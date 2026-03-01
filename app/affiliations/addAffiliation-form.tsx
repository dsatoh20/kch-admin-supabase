'use client'

import { Button } from '@/components/ui/button'
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase/client'
import { useState } from "react"
import { useRouter } from "next/navigation";


export default function AddAffiliationForm() {
    const [name, setName] = useState<string>('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    async function insertAffiliation() {
        if (loading) return;
        setLoading(true);

        const supabase = createClient()
        const { data, error } = await supabase
            .from('club_affiliations')
            .insert({ name })
            .select()
            .single()
            
        if (error) {
            console.error('Error inserting affiliation:', error)
            alert('Failed to add affiliation. Please try again.')
        } else {
            alert(`Affiliation "${data.name}" added successfully!`)
            setName('')
            router.refresh() // 所属先追加後にサーバーのデータを再取得して画面を更新する
        }

        setLoading(false);
    }
  return (
    <div className='w-full max-w-md border rounded p-4'>
      <p className="text-lg font-bold mb-4">Add New Affiliation</p>
      <form className="space-y-4">
        <FieldGroup>
            <Field>
            <FieldLabel htmlFor="name">Affiliation Name</FieldLabel>
            <Input 
               type="text"
               name="name"
               id="name"
               value={name}
               onChange={(e) => setName(e.target.value)}
               className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
            />
            <FieldDescription>Must be unique.</FieldDescription>
            </Field>
            <Field>
                <Button type="button" onClick={insertAffiliation} disabled={!name.trim() || loading}>
                    {loading ? 'Adding...' : 'Add New Affiliation'}
                </Button>
            </Field>
        </FieldGroup>
        </form>
    </div>
  )
}
