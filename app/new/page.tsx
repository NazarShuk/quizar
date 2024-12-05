"use client";
import { ChangeEvent, ChangeEventHandler, useState } from "react";
import { submitCustomTerms } from "../actions";
import { useRouter } from "next/navigation";

export default function TermsCreator(){
    const [terms, setTerms] = useState<Array<{term: string, definition: string}>>([])
    const router = useRouter()

    async function submitTerms(data : FormData) {
        try{
            const id = await submitCustomTerms(data)

            router.push(`/terms/${id}`)

        }
        catch(e){
            alert(e)
        }
    }

    return (
        <div className={"text-center"}>
            <h1 className={"text-2xl"}>Create new Quizar</h1>

            <form action={submitTerms} className="mb-5">
                <input name="name" placeholder="Name" required></input>
                <input value={JSON.stringify(terms)} hidden name="terms"></input>
                <button>Submit</button>
            </form>

            <TermsList onUpdate={(t) => setTerms(t)} />
        </div>
    )
}

function TermsList({onUpdate} : {onUpdate : (terms : Array<{term: string, definition: string}>) => void}){
    const [terms, setTerms] = useState([{ id: 1, term: "", definition: ""}])

    function addTerm(){
        const newId = terms.length > 0 
            ? Math.max(...terms.map(t => t.id)) + 1 
            : 1;
        setTerms([...terms, { id: newId, term: "", definition: ""}])

        onUpdate(getTerms())
    }

    function removeTerm(idToRemove : number){
        setTerms(currentTerms => 
            currentTerms.filter(term => term.id !== idToRemove)
        )
        onUpdate(getTerms())
    }

    function updateTerm(id : number, term: string, definition: string){
        for (let i = 0; i < terms.length; i++) {
            if(terms[i].id == id){
                terms[i].term = term
                terms[i].definition = definition

                onUpdate(getTerms())
                break
            }
        }
    }

    function getTerms(){

        function removeProp(obj: any, prop: string) {
            const { [prop]: removedProp, ...rest } = obj;
            return rest;
        }

        const finalTerms = JSON.parse(JSON.stringify(terms))
        for (let i = 0; i < finalTerms.length; i++) {
            const element = finalTerms[i];
            
            finalTerms[i] = removeProp(element, "id")

        }

        return finalTerms
    }

    return (
        <div>

            <ul>
                {terms.map((term)=>(
                    <Term
                        onRemove={() => removeTerm(term.id)}
                        onUpdate={(termS, definition) => updateTerm(term.id, termS, definition)}
                        key={term.id} 
                    />
                ))}
            </ul>

            <button onClick={addTerm} className="p-2.5 bg-gray-100 rounded">
                Add more terms
            </button>
        </div>
    )
}

function Term({onRemove, onUpdate} : {onRemove: () => void, onUpdate: (term : string, definition : string)=> void}){
    const [term, setTerm] = useState("")
    const [definition, setDefinition] = useState("")
    
    function onTermChange(e : ChangeEvent<HTMLTextAreaElement>){
        setTerm(e.target.value)
        onUpdate(term, definition)
    }

    function onDefinitionChange(e : ChangeEvent<HTMLTextAreaElement>){
        setDefinition(e.target.value)
        onUpdate(term, definition)
    }

    return (
        <li className="min-h-20 bg-gray-100 mb-1.5 p-1 flex flex-col items-center justify-between text-center rounded">
            <button onClick={onRemove}>X</button>
            <div className="flex items-center justify-between gap-2.5 h-full w-full">
                <textarea onChange={onTermChange} className="resize-none h-full w-full" placeholder="Term"></textarea>
                <textarea onChange={onDefinitionChange} className="resize-none h-full w-full" placeholder="Definition"></textarea>
            </div>
        </li>
    )
}