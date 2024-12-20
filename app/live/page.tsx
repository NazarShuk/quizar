"use client";
import { useEffect, useState, useRef } from "react"
import { Peer, DataConnection } from "peerjs"
import SubmitButton from "@/lib/SubmitButton";
import { useUser } from "@clerk/nextjs";
import Image from "next/image"
import { MotionConfig } from "motion/react";

enum ClientPacketTypes {
    Question = 'question',
    Screen = 'screen',
    Score = 'score',
}

interface ServerPeerPacket {
    type: ClientPacketTypes,
    data: object
}

export default function LivePage() {

    const [peer, setPeer] = useState<Peer | null>(null)
    const [connection, setConnection] = useState<DataConnection | null>(null)
    const peerIdRef = useRef<HTMLInputElement>(null)
    const usernameRef = useRef<HTMLInputElement>(null)

    const [screen, setScreen] = useState<string | null>("waiting")
    const { user } = useUser()

    const [question, setQuestion] = useState<{ termID: number, term: string, answers: Array<string> }>()
    const [score , setScore] = useState(0)

    const [connecting, setConnecting] = useState(false)
    const [ready, setReady] = useState(false)

    useEffect(() => {
        const peer = new Peer()
        setPeer(peer)
        peer.on("open", () => {
            setReady(true)
        })

    }, [])

    function connect(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const peerId = peerIdRef.current?.value
        if (!peerId) {
            return
        }
        setConnecting(true)
        const connection = peer?.connect("quizar-" + peerId, {
            metadata: {
                username: usernameRef.current?.value || "User",
                profileUrl: user?.imageUrl || "https://via.placeholder.com/50"
            }
        })
        connection?.on("open", () => {
            console.log("open")
            setConnection(connection)
            setConnecting(false)
        })
        connection?.on("data", (data) => {
            handlePackets(JSON.parse(data as string))
        })
        connection?.on("close", () => {
            window.location.reload()
        })

        function handlePackets(packet: ServerPeerPacket) {
            if (packet.type === ClientPacketTypes.Screen) {
                //@ts-expect-error we know that packet.data is an object
                const screen = packet.data.screen as string
                setScreen(screen)
            }
            else if (packet.type === ClientPacketTypes.Question) {
                //@ts-expect-error we know that packet.data is an object
                const termID = packet.data.termID as number
                //@ts-expect-error we know that packet.data is an object
                const answers = packet.data.answers as Array<string>
                //@ts-expect-error we know that packet.data is an object
                const term = packet.data.term as string

                setQuestion({
                    termID,
                    term: term,
                    answers: answers,
                })
            }
            else if (packet.type === ClientPacketTypes.Score) {
                //@ts-expect-error we know that packet.data is an object
                const score = packet.data.score as number
                setScore(score)
            }
        }
    }

    function handleAnswer(answer: string) {
        connection?.send(JSON.stringify({
            type: ClientPacketTypes.Question,
            data: {
                termID: question?.termID,
                answer: answer,
            }
        }))
    }



    if (!connection) {
        return (
            <div>
                <h1 className={"text-3xl mb-2.5 font-bold text-center"}>Connect to a game</h1>
                <form onSubmit={connect} className="flex flex-col justify-start w-1/2 m-auto">
                    <input maxLength={10} className={"mb-1 p-1 bg-gray-100 rounded dark:bg-gray-700 dark:text-white"} type="text" placeholder="Enter game code" required ref={peerIdRef} />
                    <input maxLength={30} className={"mb-1 p-1 bg-gray-100 rounded dark:bg-gray-700 dark:text-white"} type="text" placeholder="Enter username" required defaultValue={user?.username || ""} ref={usernameRef} />
                    <button aria-disabled={connecting} disabled={connecting} className={`text-black bg-gray-100 dark:bg-gray-800 dark:text-white p-2.5 rounded ${connecting ? "animate-pulse" : ""}`} type="submit">
                        {connecting ? "Connecting..." : "Connect"}
                    </button>
                </form>
            </div>
        )
    }


    return (
        <div>
            <div className="flex flex-row justify-between items-center bg-gray-100 dark:bg-gray-800 dark:text-white rounded p-1 mb-2.5">
                <div className="flex flex-row justify-start items-center gap-2.5">
                    <Image className="rounded-full" src={user?.imageUrl || "https://via.placeholder.com/50"} alt={usernameRef.current?.value || "User"} width={50} height={50} />
                    <h1 className="text-2xl font-bold">{connection?.metadata.username || "User"}</h1>
                </div>
                <h1><span> {score} </span> score</h1>
            </div>

            {screen === "waiting" && <WaitingScreen />}
            {(screen === "questions" && question) && <QuestionScreen question={question.term} answers={question.answers} onAnswered={(answer) => handleAnswer(answer)} />}
            {(screen === "correct" && question) && <CorrectScreen />}
            {(screen === "wrong" && question) && <WrongScreen />}
        </div>
    )
}

function CorrectScreen(){
    return (
        <div className="flex w-full flex-col justify-center items-center bg-green-100 dark:bg-green-800 p-2 rounded">
            <h1 className="text-2xl font-bold">Correct!</h1>
        </div>
    )
}

function WrongScreen(){
    return (
        <div className="flex w-full flex-col justify-center items-center bg-red-100 dark:bg-red-800 p-2 rounded">
            <h1 className="text-2xl font-bold">Wrong!</h1>
        </div>
    )
}

function QuestionScreen({ question, answers, onAnswered }: { question: string, answers: Array<string>, onAnswered: (answer: string) => void }) {
    return (
        <div
            className="pb-4"
        >
            <p className="text-xl mb-3">{question}</p>

            <div className="space-y-2">
                {answers.map((answer, answerIndex) => {
                    return (
                        <button
                            key={answerIndex}
                            onClick={() =>
                                onAnswered(answer)
                            }
                            className={`w-full p-2 text-left border dark:border-gray-700 rounded hover:bg-gray-100 dark:hover:bg-gray-800 active:scale-95 transition`}
                        >
                            {answer}
                        </button>
                    );
                })}
            </div>
        </div>
    )
}

function WaitingScreen() {
    return (
        <div>
            <h1>Waiting for host to start!</h1>
        </div>
    )
}