import { getTermsPage } from "../db";

export default async function Terms(){
    const terms = await getTermsPage(0)

    return (
        <div>
            <ul>
                {terms.map((termsItem, index)=>(
                    <li key={index}>{termsItem as any}</li>
                ))}
            </ul>
        </div>
    )
}