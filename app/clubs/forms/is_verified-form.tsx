'use client'
import { useCallback, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field'
import { Checkbox } from '@/components/ui/checkbox'


export default function IsVerifiedForm({ club_id }: { club_id: number | null }) {
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [isVerified, setIsVerified] = useState<boolean>(false)
  const [initialIsVerified, setInitialIsVerified] = useState<boolean>(false)
  const [created_at, setCreatedAt] = useState<string | null>(null)
  
  const getIsVerified = useCallback(async () => {
    if (!club_id) return
    try {
      setLoading(true)

      const { data, error, status } = await supabase
        .from('is_verified')
        .select(`id, club_id, created_at`)
        .eq('club_id', club_id)
        .single()

      if (error && status !== 406) {
        console.log(error)
        throw error
      }

      if (data) {
        setIsVerified(true)
        setInitialIsVerified(true)
        setCreatedAt(data.created_at)
      } else {
        setIsVerified(false)
        setInitialIsVerified(false)
      }
    } catch (error) {
      console.log('エラー:', error)
      alert('Error loading is_verified data!')
      
    } finally {
      setLoading(false)
    }
  }, [club_id, supabase])

  useEffect(() => {
    getIsVerified()
  }, [getIsVerified])

  async function updateIsVerified() {
    // sql的には、updateでなく、insert or delete
    if (!club_id) return

    if (isVerified === initialIsVerified) {
      alert('No changes to save.')
      return
    }

    try {
      setLoading(true)

      if (isVerified) {
        // It's now true, was false before -> INSERT
        const { error } = await supabase.from('is_verified').insert({ club_id })
        if (error) throw error
        alert('Verified this club!')
      } else {
        // It's now false, was true before -> DELETE
        const { error } = await supabase
          .from('is_verified')
          .delete()
          .eq('club_id', club_id)
        if (error) throw error
        alert('Unverified this club!')
      }
      // On success, update the initial state to the current state
      setInitialIsVerified(isVerified)
    } catch (error) {
      alert('Error updating the data!')
    } finally {
      setLoading(false)
    }
  
  }

  return (
    <div className='w-full max-w-md border p-4 rounded'>
      <form>
        <FieldGroup>
          {/* ... */}
          <Field orientation="horizontal">
            <Checkbox
              id="is_verified"
              checked={isVerified}
              onCheckedChange={(checked) => {
                // The `checked` parameter can be boolean or 'indeterminate'
                // We only care about the boolean state.
                setIsVerified(checked === true)
              }}
            />
            <FieldLabel
              htmlFor="is_verified"
              className="font-normal"
            >
              Is Verified
            </FieldLabel>
          </Field>

          <Field>
            <Button
              type="button"
              className="button primary block"
              onClick={updateIsVerified}
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