'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { ClubEvent } from '@/types/types'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'

// helper component for editing a club event record

export default function ClubEventForm({ club_event }: { club_event: ClubEvent | null }) {
  const supabase = createClient()
  const [loading, setLoading] = useState(false)

  const [club_id, setClubId] = useState<number | null>(null)
  const [club_name, setClubName] = useState<string | null>(null)
  const [date, setDate] = useState<string | null>(null)
  const [start_time, setStartTime] = useState<string | null>(null)
  const [end_time, setEndTime] = useState<string | null>(null)
  const [location, setLocation] = useState<string | null>(null)
  const [description, setDescription] = useState<string | null>(null)
  const [created_at, setCreatedAt] = useState<string | null>(null)
  const [updated_at, setUpdatedAt] = useState<string | null>(null)
  const [image_url, setImageUrl] = useState<string | null>(null)
  const [url, setUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  useEffect(() => {
    if (club_event) {
      setClubId(club_event.club_id)
      setClubName(club_event.club_name)
      setDate(club_event.date)
      setStartTime(club_event.start_time)
      setEndTime(club_event.end_time)
      setLocation(club_event.location)
      setDescription(club_event.description)
      setCreatedAt(club_event.created_at)
      setUpdatedAt(club_event.updated_at)
      setImageUrl(club_event.image_url)
      setUrl(club_event.url)
    }
  }, [club_event])

  async function handleImageUpload(file: File) {
    if (!club_event?.id) {
      alert('Club Event ID is not available. Please save the club first.');
      return;
    }
    try {
      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const filePath = `${club_event.id}/event.${fileExt}`;

      // 1. Upload the file with upsert:true to overwrite existing file
      const { error: uploadError } = await supabase.storage
        .from('club_events_images')
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        throw uploadError;
      }

      // 2. Get the public URL for the uploaded file
      const { data: urlData } = supabase.storage
        .from('club_events_images')
        .getPublicUrl(filePath);

      // 3. Update the state to show preview and save to DB later
      setImageUrl(urlData.publicUrl);
    } catch (error: any) {
      console.error('Error uploading club event image:', error);
      alert(`Error uploading image: ${error.message}`);
    } finally {
      setUploading(false);
    }
  }

  async function updateClubEvent() {
    if (!club_event?.id) {
      alert('No club event selected for update.')
      return
    }
    // log payload for debugging
    console.log('update payload', { club_id, club_name, date, start_time, end_time, location, description, image_url, url, id: club_event?.id })
    try {
      setLoading(true)

      const { error } = await supabase
        .from('club_events')
        .update({ club_name, date, start_time, end_time, location, description, image_url, url })
        .eq('id', club_event.id) // club_event.idで更新対象を特定
        
      if (error) {
        console.error('supabase update error', { error })
        throw error
      }
      alert('Club updated!')
    } catch (error: any) {
      console.error('updateClub caught error', error)
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
            <FieldLabel htmlFor="club_name">Club Name</FieldLabel>
            <Input
                id="club_name"
                type="text"
                value={club_name || ''}
                onChange={(e) => setClubName(e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="date">Date</FieldLabel>
            <Input
              id="date"
              type="date"
                value={date || ''}
                onChange={(e) => setDate(e.target.value)}
            />
            <FieldDescription>Format: YYYY-MM-DD</FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor="start_time">Start Time</FieldLabel>
            <Input
              id="start_time"
              type="time"
                value={start_time || ''}
                onChange={(e) => setStartTime(e.target.value)}
            />
            <FieldDescription>Format: HH:MM</FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor="end_time">End Time</FieldLabel>
            <Input
              id="end_time"
              type="time"
                value={end_time || ''}
                onChange={(e) => setEndTime(e.target.value)}
            />
            <FieldDescription>Format: HH:MM</FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor="location">Location</FieldLabel>
            <Input
              id="location"
              type="text"
                value={location || ''}
                onChange={(e) => setLocation(e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="description">Description</FieldLabel>
            <Input
              id="description"
                type="text"
                value={description || ''}
                onChange={(e) => setDescription(e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="image_url">Event Image</FieldLabel>
            {image_url && (
              <div className="my-2">
                <img src={image_url} alt="Adv Preview" className="w-32 h-32 object-cover rounded" />
              </div>
            )}
            <Input
              id="image_url"
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file) {
                  await handleImageUpload(file);
                }
              }}
              disabled={uploading}
            />
            {uploading && <p className="text-sm text-gray-500 mt-1">Uploading...</p>}
            <FieldDescription>Select a picture to upload.</FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor="url">Event URL</FieldLabel>
            <Input
              id="url"
                type="url"
                value={url || ''}
                onChange={(e) => setUrl(e.target.value)}
            />
          </Field>
          

          <Field>
            <Button
              className="button primary block"
              onClick={updateClubEvent}
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