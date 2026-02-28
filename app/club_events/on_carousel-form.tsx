'use client'
import { useCallback, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { FieldGroup, Field, FieldLabel, FieldDescription } from '@/components/ui/field'
import { Checkbox } from '@/components/ui/checkbox'


export default function OnCarouselForm({ event_id }: { event_id: number | null }) {
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [onCarousel, setOnCarousel] = useState<boolean>(false)
  const [initialOnCarousel, setInitialOnCarousel] = useState<boolean>(false)
  const [created_at, setCreatedAt] = useState<string | null>(null)
  
  const getOnCarousel = useCallback(async () => {
    if (!event_id) return
    try {
      setLoading(true)

      const { data, error, status } = await supabase
        .from('on_carousel')
        .select(`id, club_events_id, created_at`)
        .eq('club_events_id', event_id)
        .single()

      if (error && status !== 406) {
        console.log(error)
        throw error
      }

      if (data) {
        setOnCarousel(true)
        setInitialOnCarousel(true)
        setCreatedAt(data.created_at)
      } else {
        setOnCarousel(false)
        setInitialOnCarousel(false)
      }
    } catch (error) {
      console.log('エラー:', error)
      alert('Error loading on_carousel data!')
      
    } finally {
      setLoading(false)
    }
  }, [event_id, supabase])

  useEffect(() => {
    getOnCarousel()
  }, [getOnCarousel])

  async function updateOnCarousel() {
    // sql的には、updateでなく、insert or delete
    if (!event_id) return

    if (onCarousel === initialOnCarousel) {
      alert('No changes to save.')
      return
    }

    try {
      setLoading(true)

      if (onCarousel) {
        // It's now true, was false before -> INSERT
        const { error } = await supabase.from('on_carousel')
          .insert({ club_events_id: event_id })
        if (error) throw error
        alert('Added to carousel!')
      } else {
        // It's now false, was true before -> DELETE
        const { error } = await supabase
          .from('on_carousel')
          .delete()
          .eq('club_events_id', event_id)
        if (error) throw error
        alert('Removed from carousel!')
      }
      // On success, update the initial state to the current state
      setInitialOnCarousel(onCarousel)
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
              id="on_carousel"
              checked={onCarousel}
              onCheckedChange={(checked) => {
                // The `checked` parameter can be boolean or 'indeterminate'
                // We only care about the boolean state.
                setOnCarousel(checked === true)
              }}
            />
            <FieldLabel
              htmlFor="on_carousel"
              className="font-normal"
            >
              Is Verified
            </FieldLabel>
            
          </Field>

          <Field>
            <Button
              type="button"
              className="button primary block"
              onClick={updateOnCarousel}
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