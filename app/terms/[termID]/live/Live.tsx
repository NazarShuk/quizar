"use client";
import { DataConnection, Peer } from "peerjs"
import { useEffect, useState, useCallback } from "react"
import { motion, AnimatePresence } from 'framer-motion';
import Image from "next/image"

interface LiveConnection {
    connection: DataConnection,
    username: string,
    profileUrl: string,
    score: number,
}

enum ClientPacketTypes {
    Question = 'question',
}

interface ClientPeerPacket {
    type: ClientPacketTypes,
    data: object
}

export default function Live({ terms }: { terms: Array<{ term: string, definition: string }> }) {
    const [peer, setPeer] = useState<Peer | null>(null)
    const [peerId, setPeerId] = useState<string | null>(null)
    const [connections, setConnections] = useState<Array<LiveConnection>>([])
    const [screen, setScreen] = useState<string>("waiting")
    
    const [time, setTime] = useState<number>(300)

    const getRandomQuestion = useCallback(() => {
        const id = Math.floor(Math.random() * terms.length)
        const answer = terms.map((term) => term.definition)[id]

        return {
            termID: id,
            term: terms[id].term,
            answer: answer,
        }
    }, [terms])

    const sendScreen = useCallback((connection: LiveConnection, screen: string) => {
        connection.connection.send(JSON.stringify({
            type: "screen",
            data: {
                screen: screen,
            }
        }))
    }, [])

    const sendQuestion = useCallback((connection: LiveConnection, termID: number, answerChoices: string[], term: string) => {
        connection.connection.send(JSON.stringify({
            type: "question",
            data: {
                termID: termID,
                term: term,
                answers: answerChoices,
            }
        }))
    }, [])

    const sendScore = useCallback((connection: LiveConnection, score: number) => {
        connection.connection.send(JSON.stringify({
            type: "score",
            data: {
                score: score,
            }
        }))
    }, [])

    const broadcastQuestion = useCallback((termID: number, answerChoices: Array<string>, term: string) => {
        connections.forEach((connection) => {
            sendQuestion(connection, termID, answerChoices, term)
        })
    }, [connections, sendQuestion])

    const broadcastScreen = useCallback((screen: string) => {
        connections.forEach((connection) => {
            sendScreen(connection, screen)
        })
    }, [connections, sendScreen])

    const startGame = useCallback(() => {
        broadcastScreen("questions")
        const answerChoices = []
        const { termID, answer, term } = getRandomQuestion()
        answerChoices.push(answer)

        // add random answer choices
        for (let i = 0; i < 3; i++) {
            const { answer } = getRandomQuestion()
            if (answerChoices.includes(answer)) continue
            answerChoices.push(answer)
        }
        broadcastQuestion(termID, answerChoices, term)

        setScreen("leaderboard")
    }, [broadcastScreen, broadcastQuestion, getRandomQuestion])

    const handlePackets = useCallback((peerID: string, packet: ClientPeerPacket) => {
        if (packet.type === ClientPacketTypes.Question) {
            //@ts-expect-error we know that packet.data is an object
            const receivedTermID = packet.data.termID as number
            //@ts-expect-error we know that packet.data is an object
            const receivedAnswer = packet.data.answer as string

            setConnections((prevConnections) => prevConnections.map((connection) => {
                if (connection.connection.peer === peerID) {
                    const newConnection = { ...connection }
                    if (terms[receivedTermID].definition === receivedAnswer) {
                        newConnection.score += 100
                        sendScreen(newConnection, "correct")
                    } else {
                        newConnection.score -= 100
                        sendScreen(newConnection, "wrong")
                    }

                    sendScore(newConnection, newConnection.score)

                    setTimeout(() => {
                        sendScreen(newConnection, "questions")

                        const answerChoices = []
                        const { termID, answer, term } = getRandomQuestion()
                        answerChoices.push(answer)
                
                        // add random answer choices
                        for (let i = 0; i < 3; i++) {
                            let { answer } = getRandomQuestion()
                            while (answerChoices.includes(answer)) {
                                answer = getRandomQuestion().answer
                            }
                            answerChoices.push(answer)
                        }

                        // shuffle answerChoices
                        answerChoices.sort(() => Math.random() - 0.5)

                        sendQuestion(newConnection, termID, answerChoices, term)

                    }, 2000)
                    return newConnection
                }
                return connection
            }))
        }
    }, [terms, sendScreen, sendQuestion, getRandomQuestion, sendScore])

    useEffect(() => {
        const newPeer = new Peer(`quizar-${Math.random().toString(36).substring(2).slice(0, 5)}`)
        setPeer(newPeer)

        newPeer.on("open", (id) => {
            setPeerId(id)
        })

        newPeer.on("connection", (connection) => {
            setConnections((prevConnections) => [...prevConnections, {
                connection,
                username: connection.metadata.username,
                profileUrl: connection.metadata.profileUrl,
                score: 0,
            }])

            connection.on("data", (data) => {
                handlePackets(connection.peer, JSON.parse(data as string))
            })

            connection.on("close", () => {
                setConnections((prevConnections) => 
                    prevConnections.filter((conn) => conn.connection.peer !== connection.peer)
                )
            })

            connection.on("error", (error) => {
                console.error(error)
            })
        })

        return () => {
            newPeer.destroy()
        }
    }, [handlePackets]) // Only include handlePackets in dependencies

    if (!peerId) return <div>Connecting...</div>

    return (
        <div>
            {screen === "waiting" &&
                <div>
                    <h1 className="text-2xl">Go to <span className="underline">quizar.nshis.com/live</span></h1>
                    <h1 className="text-xl">And enter this code:</h1>
                    <h1 className="text-2xl font-bold">{peerId.replace("quizar-", "")}</h1>
                </div>
            }
            {screen === "leaderboard" && <TimeDisplay seconds={time} />}
            

            {(screen === "waiting") && 
                <button 
                    className="text-black bg-gray-100 dark:bg-gray-800 dark:text-white p-2.5 rounded" 
                    onClick={startGame}
                >
                    Start
                </button>
            }

            {screen === "waiting" && <UsersList connections={connections} />}
            {screen === "leaderboard" && <UsersLeaderboard connections={connections} />}
        </div>
    )
}

function UsersLeaderboard({ connections }: { connections: Array<LiveConnection> }) {
    const sortedConnections = connections.sort((a, b) => b.score - a.score);

    return (
        <ul className="space-y-2.5">
          <AnimatePresence initial={false}>
            {sortedConnections.map((connection) => (
              <motion.li
                key={connection.connection.peer}
                layout
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="flex flex-row justify-between items-center w-full h-16 dark:bg-gray-800 dark:text-white rounded p-1"
              >
                <div className="flex flex-row justify-start items-center gap-2.5">
                  <Image 
                    className="rounded-full" 
                    src={connection.profileUrl} 
                    alt={connection.username} 
                    width={50} 
                    height={50} 
                  />
                  <h1>{connection.username}</h1>
                </div>
                <motion.span
                  key={connection.score}
                  initial={{ scale: 1.2, color: "#22c55e" }}
                  animate={{ scale: 1, color: "inherit" }}
                  transition={{ duration: 0.3 }}
                >
                  {connection.score}
                </motion.span>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      );
}

function UsersList({ connections }: { connections: Array<LiveConnection> }) {
    return (
        <div className="flex flex-row flex-wrap justify-center gap-2.5">
            {connections.length === 0 && <h1 className="opacity-50">No one is here yet :(</h1>}
            {connections.map((connection) => (
                <LiveUser key={connection.connection.peer} username={connection.username} profileUrl={connection.profileUrl} />
            ))}
        </div>
    )
}

function LiveUser({ username, profileUrl }: { username: string, profileUrl: string }) {
    return (
        <div className="flex flex-row justify-start gap-2.5 items-center min-w-48 h-16 dark:bg-gray-800 dark:text-white rounded p-1">
            <Image className="rounded-full" src={profileUrl} alt={username} width={50} height={50} />
            <h1>{username}</h1>
        </div>
    )
}

function TimeDisplay({ seconds } : { seconds: number }) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
  
    const formattedTime = `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  
    return <h1 className="text-4xl font-bold m-auto text-center">{formattedTime}</h1>;
}