'use client'
import { useCallback, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { ClubTag, Tag } from '@/types/types'
import { Button } from '@/components/ui/button'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Checkbox } from '@/components/ui/checkbox'

// helper component for editing a club record

export default function ClubTagsForm({ club_id, tags }: { club_id: number | null, tags: Tag[] }) {
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [club_tags, setClubTags] = useState<ClubTag[] | null>(null)
  // 差分更新のために初期状態を保持
  const [initialClubTags, setInitialClubTags] = useState<ClubTag[] | null>(null)
  
  const getClubTags = useCallback(async () => {
    if (!club_id) return
    try {
      setLoading(true)

      const { data, error, status } = await supabase
        .from('club_tags')
        .select(`id, club_id, tag_id, created_at, updated_at`)
        .eq('club_id', club_id) // club_idで絞込 --> 複数レコードが返る

      if (error && status !== 406) {
        console.log(error)
        throw error
      }

      if (data) {
        setClubTags(data)
        setInitialClubTags(data) // 初期状態を保存
      }
    } catch (error) {
      console.log('エラー:', error)
      alert('Error loading club tags data!')
      
    } finally {
      setLoading(false)
    }
  }, [club_id, supabase])

  useEffect(() => {
    getClubTags()
  }, [getClubTags])

  async function updateClubTags() {
    if (!club_id) return

    try {
      setLoading(true)

      const initialTagIds = new Set(initialClubTags?.map(ct => ct.tag_id) || [])
      const currentTagIds = new Set(club_tags?.map(ct => ct.tag_id) || [])

      // 削除すべきタグ (初期状態にはあったが、現在の状態にはない)
      const tagsToDelete = [...initialTagIds].filter(id => !currentTagIds.has(id))

      // 挿入すべきタグ (初期状態にはなかったが、現在の状態にはある)
      const tagsToInsert = [...currentTagIds].filter(id => !initialTagIds.has(id))

      const promises = []

      if (tagsToDelete.length > 0) {
        promises.push(
          supabase
            .from('club_tags')
            .delete()
            .eq('club_id', club_id)
            .in('tag_id', tagsToDelete)
        )
      }

      if (tagsToInsert.length > 0) {
        const newClubTags = tagsToInsert.map(tag_id => ({
          club_id: club_id,
          tag_id: tag_id,
        }))
        promises.push(supabase.from('club_tags').insert(newClubTags))
      }

      const results = await Promise.all(promises)
      const errors = results.map(res => res.error).filter(Boolean)

      if (errors.length > 0) {
        throw new Error(errors.map(e => e?.message).join('\n'))
      }

      alert('Club tags updated successfully!')
      // 更新成功後、初期状態を現在の状態にリセット
      setInitialClubTags(club_tags)
    } catch (error) {
      console.log('エラー:', error)
      alert('Error updating club tags data!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='w-full max-w-md border p-4 rounded'>
      <form>
        <FieldGroup>
          {/* ... */}
          {tags.map((tag) => (
            <Field orientation="horizontal" key={tag.id}>
              <Checkbox
                id={`tag-${tag.id}`}
                checked={!!club_tags?.some((ct) => ct.tag_id === tag.id)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    const newClubTag: ClubTag = {
                      id: 0, // DBで自動採番されるため一時的な値
                      club_id: club_id!,
                      tag_id: tag.id,
                      created_at: new Date().toISOString(), // DB側で設定されるため一時的な値
                      updated_at: new Date().toISOString(), // DB側で設定されるため一時的な値
                    };
                    setClubTags((prev) => [...(prev || []), newClubTag]);
                  } else {
                    setClubTags((prev) => prev?.filter((ct) => ct.tag_id !== tag.id) || null)
                  }
                }}
              />
              <FieldLabel htmlFor={`tag-${tag.id}`} className="font-normal">{tag.name}</FieldLabel>
            </Field>
          ))}
          <Field>
            <Button
              type="button"
              className="button primary block"
              onClick={updateClubTags}
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