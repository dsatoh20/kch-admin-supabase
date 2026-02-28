'use client'
import { useCallback, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Club, ClubAffiliation } from '@/types/types'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'

// helper component for editing a club record

export default function ClubForm({ club, clubAffiliations }: { club: Club | null, clubAffiliations: ClubAffiliation[] }) {
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [slug, setSlug] = useState<string | null>(null)
  const [name, setName] = useState<string | null>(null)
  const [profile_image_url, setProfileImageUrl] = useState<string | null>(null)
  const [club_affiliation_id, setClubAffiliationId] = useState<number | null>(null)
  const [founding_year, setFoundingYear] = useState<number | null>(null)
  const [created_at, setCreatedAt] = useState<string | null>(null)
  const [updated_at, setUpdatedAt] = useState<string | null>(null)
  const [owner_id, setOwnerId] = useState<string | null>(null)

  useEffect(() => {
    if (club) {
      setSlug(club.slug)
      setName(club.name)
      setProfileImageUrl(club.profile_image_url)
      setClubAffiliationId(club.club_affiliation_id)
      setFoundingYear(club.founding_year)
      setCreatedAt(club.created_at)
      setUpdatedAt(club.updated_at)
      setOwnerId(club.owner_id)
    }
  }, [club])

  async function handleImageUpload(file: File) {
    if (!club?.id) {
      alert('Club ID is not available. Please save the club first.');
      return;
    }
    try {
      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const filePath = `${club.id}/profile.${fileExt}`;

      // 1. Upload the file with upsert:true to overwrite existing file
      const { error: uploadError } = await supabase.storage
        .from('clubs_profile_images')
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        throw uploadError;
      }

      // 2. Get the public URL for the uploaded file
      const { data: urlData } = supabase.storage
        .from('clubs_profile_images')
        .getPublicUrl(filePath);

      // 3. Update the state to show preview and save to DB later
      setProfileImageUrl(urlData.publicUrl);
    } catch (error: any) {
      console.error('Error uploading profile image:', error);
      alert(`Error uploading image: ${error.message}`);
    } finally {
      setUploading(false);
    }
  }



  async function updateClub() {
    if (!club?.id) {
      alert('No club selected for update.')
      return
    }
    // log payload for debugging
    console.log('update payload', { slug, name, profile_image_url, club_affiliation_id, founding_year, id: club?.id })
    try {
      setLoading(true)

      const { error } = await supabase
        .from('clubs')
        .update({ slug, name, profile_image_url, club_affiliation_id, founding_year })
        .eq('id', club.id) // club_idで更新対象を特定
        
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
            <FieldLabel htmlFor="slug">Slug</FieldLabel>
            <Input
              id="slug"
              type="text"
              value={slug || ''}
              onChange={(e) => setSlug(e.target.value)}
            />
            <FieldDescription>Must be unique.</FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor="name">Name</FieldLabel>
            <Input
              id="name"
              type="text"
              value={name || ''}
              onChange={(e) => setName(e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="profile_image_url">Profile Image</FieldLabel>
            {profile_image_url && (
              <div className="my-2">
                <img src={profile_image_url} alt="Profile Preview" className="w-32 h-32 object-cover rounded" />
              </div>
            )}
            <Input
              id="profile_image_url"
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
            <FieldLabel htmlFor="club_affiliation_id">Club Affiliation ID</FieldLabel>
            
            <Select
              key={club_affiliation_id}
              value={club_affiliation_id?.toString()}
              onValueChange={(value) => setClubAffiliationId(value ? parseInt(value, 10) : null)}
            >
              <SelectTrigger id="club_affiliation_id" className="w-full">
                <SelectValue placeholder="Select a club affiliation" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {clubAffiliations.map((affiliation: ClubAffiliation) => (
                    <SelectItem key={affiliation.id} value={affiliation.id.toString()}>
                      {affiliation.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel htmlFor="founding_year">Founding Year</FieldLabel>
            <Input
              id="founding_year"
              type="number"
              value={founding_year || ''}
              onChange={(e) => setFoundingYear(e.target.value ? parseInt(e.target.value, 10) : null)}
            />
          </Field>

          <Field>
            <Button
              type="button"
              className="button primary block"
              onClick={updateClub}
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