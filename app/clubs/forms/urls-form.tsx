'use client'
import { useCallback, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Url } from '@/types/types'
import { Button } from '@/components/ui/button'
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'

// helper component for editing a club record

export default function UrlsForm({ club_id }: { club_id: number | null }) {
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [instagram, setInstagram] = useState<string | null>(null)
  const [x, setX] = useState<string | null>(null)
  const [discord, setDiscord] = useState<string | null>(null)
  const [website, setWebsite] = useState<string | null>(null)
  const [created_at, setCreatedAt] = useState<string | null>(null)
  const [updated_at, setUpdatedAt] = useState<string | null>(null)
  
  const getUrls = useCallback(async () => {
    if (!club_id) return
    try {
      setLoading(true)

      const { data, error, status } = await supabase
        .from('urls')
        .select(`instagram, x, discord, website, created_at, updated_at`)
        .eq('club_id', club_id)
        .single()

      if (error && status !== 406) {
        console.log(error)
        throw error
      }

      if (data) {
        setInstagram(data.instagram)
        setX(data.x)
        setDiscord(data.discord)
        setWebsite(data.website)
        setCreatedAt(data.created_at)
        setUpdatedAt(data.updated_at)
      }
    } catch (error) {
      console.log('エラー:', error)
      alert('Error loading urls data!')
      
    } finally {
      setLoading(false)
    }
  }, [club_id, supabase])

  useEffect(() => {
    getUrls()
  }, [getUrls])

  async function updateUrls() {
    if (!club_id) return
    try {
      setLoading(true)

      const { error } = await supabase.from('urls')
      .update({
        instagram,
        x,
        discord,
        website
      })
      .eq('club_id', club_id) // club_idで更新対象を特定
      if (error) throw error
      alert('Urls updated!')
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
          <Field>
            <FieldLabel htmlFor="instagram">Instagram</FieldLabel>
            <Input
              id="instagram"
              type="text"
              value={instagram || ''}
              onChange={(e) => setInstagram(e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="x">X</FieldLabel>
            <Input
              id="x"
              type="text"
              value={x || ''}
              onChange={(e) => setX(e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="discord">Discord</FieldLabel>
            <Input
              id="discord"
              type="text"
              value={discord || ''}
              onChange={(e) => setDiscord(e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="website">Website</FieldLabel>
            <Input
              id="website"
              type="text"
              value={website || ''}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </Field>

          <Field>
            <Button
              type="button"
              className="button primary block"
              onClick={updateUrls}
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