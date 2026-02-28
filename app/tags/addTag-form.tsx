'use client'

import { Button } from '@/components/ui/button'
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase/client'
import { useState } from "react"
import { useRouter } from "next/navigation";


export default function AddTagForm() {
    const [name, setName] = useState<string>('')
    const router = useRouter()

    async function insertTag() {
        const supabase = createClient()
        const { data, error } = await supabase
            .from('tags')
            .insert({ name })
            .select()
            .single()
            
        if (error) {
            console.error('Error inserting tag:', error)
            alert('Failed to add tag. Please try again.')
        } else {
            alert(`Tag "${data.name}" added successfully!`)
            setName('')
            router.refresh() // タグ追加後にサーバーのデータを再取得して画面を更新する
        }
    }
  return (
    <div className='w-full max-w-md border rounded p-4'>
      <p className="text-lg font-bold mb-4">Add New Tag</p>
      <form className="space-y-4">
        <FieldGroup>
            <Field>
            <FieldLabel htmlFor="name">Tag Name</FieldLabel>
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
                <Button type="button" onClick={insertTag} disabled={!name.trim()}>
                    Add New Tag
                </Button>
            </Field>
        </FieldGroup>
        </form>
    </div>
  )
}
