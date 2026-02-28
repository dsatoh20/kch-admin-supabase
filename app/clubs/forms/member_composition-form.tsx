'use client'
import { useCallback, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { MemberComposition } from '@/types/types'
import { Button } from '@/components/ui/button'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'

// helper component for editing a club record

export default function MemberCompositionForm({ club_id }: { club_id: number | null }) {
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState<number | null>(null)
  const [B1, setB1] = useState<number | null>(null)
  const [B2, setB2] = useState<number | null>(null)
  const [B3, setB3] = useState<number | null>(null)
  const [B4, setB4] = useState<number | null>(null)
  const [B5, setB5] = useState<number | null>(null)
  const [B6, setB6] = useState<number | null>(null)
  const [M1, setM1] = useState<number | null>(null)
  const [M2, setM2] = useState<number | null>(null)
  const [others, setOthers] = useState<number | null>(null)
  const [male, setMale] = useState<number | null>(null)
  const [female, setFemale] = useState<number | null>(null)
  const [created_at, setCreatedAt] = useState<string | null>(null)
  const [updated_at, setUpdatedAt] = useState<string | null>(null)
  
  const getMemberComposition = useCallback(async () => {
    if (!club_id) return
    try {
      setLoading(true)

      const { data, error, status } = await supabase
        .from('member_compositions')
        .select(`total, B1, B2, B3, B4, B5, B6, M1, M2, others, male, female, created_at, updated_at`)
        .eq('club_id', club_id)
        .single()

      if (error && status !== 406) {
        console.log(error)
        throw error
      }

      if (data) {
        setTotal(data.total)
        setB1(data.B1)
        setB2(data.B2)
        setB3(data.B3)
        setB4(data.B4)
        setB5(data.B5)
        setB6(data.B6)
        setM1(data.M1)
        setM2(data.M2)
        setOthers(data.others)
        setMale(data.male)
        setFemale(data.female)
        setCreatedAt(data.created_at)
        setUpdatedAt(data.updated_at)
      }
    } catch (error) {
      console.log('エラー:', error)
      alert('Error loading member composition data!')
      
    } finally {
      setLoading(false)
    }
  }, [club_id, supabase])

  useEffect(() => {
    getMemberComposition()
  }, [getMemberComposition])

  async function updateMemberComposition() {
    if (!club_id) return
    // log payload for debugging
    console.log('update payload', { total, B1, B2, B3, B4, B5, B6, M1, M2, others, male, female })
    try {
      setLoading(true)

      const { data, error, status } = await supabase.from('member_compositions')
      .update({
        total,
        B1,
        B2,
        B3,
        B4,
        B5,
        B6,
        M1,
        M2,
        others,
        male,
        female
      })
      .eq('club_id', club_id) // club_idで更新対象を特定
      if (error) {
        console.error('supabase update error', { error, status, data })
        throw error
      }
      alert('Member composition updated!')
    } catch (error: any) {
      console.error('updateMemberComposition caught error', error)
      alert(`Error updating the data: ${error.message || error}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='w-full max-w-md border p-4 rounded'>
      <form>
        <FieldGroup>
          {/* ... */}
          <Field>
            <FieldLabel htmlFor="total">Total</FieldLabel>
            <Input
              id="total"
              type="number"
              value={total || ''}
              onChange={(e) => setTotal(e.target.value ? parseInt(e.target.value, 10) : null)}
            />
          </Field>
          <div className="grid grid-cols-3 gap-4">
          <Field>
            <FieldLabel htmlFor="B1">B1</FieldLabel>
            <Input
              id="B1"
              type="number"
              value={B1 || ''}
              onChange={(e) => setB1(e.target.value ? parseInt(e.target.value, 10) : null)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="B2">B2</FieldLabel>
            <Input
              id="B2"
              type="number"
              value={B2 || ''}
              onChange={(e) => setB2(e.target.value ? parseInt(e.target.value, 10) : null)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="B3">B3</FieldLabel>
            <Input
              id="B3"
              type="number"
              value={B3 || ''}
              onChange={(e) => setB3(e.target.value ? parseInt(e.target.value, 10) : null)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="B4">B4</FieldLabel>
            <Input
              id="B4"
              type="number"
              value={B4 || ''}
              onChange={(e) => setB4(e.target.value ? parseInt(e.target.value, 10) : null)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="B5">B5</FieldLabel>
            <Input
              id="B5"
              type="number"
              value={B5 || ''}
              onChange={(e) => setB5(e.target.value ? parseInt(e.target.value, 10) : null)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="B6">B6</FieldLabel>
            <Input
              id="B6"
              type="number"
              value={B6 || ''}
              onChange={(e) => setB6(e.target.value ? parseInt(e.target.value, 10) : null)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="M1">M1</FieldLabel>
            <Input
              id="M1"
              type="number"
              value={M1 || ''}
              onChange={(e) => setM1(e.target.value ? parseInt(e.target.value, 10) : null)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="M2">M2</FieldLabel>
            <Input
              id="M2"
              type="number"
              value={M2 || ''}
              onChange={(e) => setM2(e.target.value ? parseInt(e.target.value, 10) : null)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="others">Others</FieldLabel>
            <Input
              id="others"
              type="number"
              value={others || ''}
              onChange={(e) => setOthers(e.target.value ? parseInt(e.target.value, 10) : null)}
            />
          </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel htmlFor="male">Male</FieldLabel>
            <Input
              id="male"
              type="number"
              value={male || ''}
              onChange={(e) => setMale(e.target.value ? parseInt(e.target.value, 10) : null)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="female">Female</FieldLabel>
            <Input
              id="female"
              type="number"
              value={female || ''}
              onChange={(e) => setFemale(e.target.value ? parseInt(e.target.value, 10) : null)}
            />
          </Field>
          </div>

          <Field>
            <Button
              type="button"
              className="button primary block"
              onClick={updateMemberComposition}
              disabled={loading}
            >
              {loading ? 'Loading ...' : 'Update'}
            </Button>
          </Field>
        </FieldGroup>
      </form>

      
    </div>
  )
}