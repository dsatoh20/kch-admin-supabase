'use client'
import { useCallback, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

// helper component for editing a club record

export default function ClubInfoForm({ club_id }: { club_id: number | null }) {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [description, setDescription] = useState<string | null>(null)
  const [location, setLocation] = useState<string | null>(null)
  const [frequency, setFrequency] = useState<string | null>(null)
  const [banquet, setBanquet] = useState<string | null>(null)
  const [record, setRecord] = useState<string | null>(null)
  const [membership_fee, setMembershipFee] = useState<string | null>(null)
  const [initial_cost, setInitialCost] = useState<string | null>(null)
  const [feeling_positive, setFeelingPositive] = useState<string | null>(null)
  const [feeling_negative, setFeelingNegative] = useState<string | null>(null)
  const [created_at, setCreatedAt] = useState<string | null>(null)
  const [updated_at, setUpdatedAt] = useState<string | null>(null)
  
  const getClubInfo = useCallback(async () => {
    if (!club_id) return
    try {
      setLoading(true)

      const { data, error, status } = await supabase
        .from('club_infos')
        .select(`description, location, frequency, banquet, record, membership_fee, initial_cost, feeling_positive, feeling_negative, created_at, updated_at`)
        .eq('club_id', club_id)
        .single()

      if (error && status !== 406) {
        console.log(error)
        throw error
      }

      if (data) {
        setDescription(data.description)
        setLocation(data.location)
        setFrequency(data.frequency)
        setBanquet(data.banquet)
        setRecord(data.record)
        setMembershipFee(data.membership_fee)
        setInitialCost(data.initial_cost)
        setFeelingPositive(data.feeling_positive)
        setFeelingNegative(data.feeling_negative)
        setCreatedAt(data.created_at)
        setUpdatedAt(data.updated_at)
      }
    } catch (error) {
      console.log('エラー:', error)
      alert('Error loading club data!')
      
    } finally {
      setLoading(false)
    }
  }, [club_id, supabase])

  useEffect(() => {
    getClubInfo()
  }, [getClubInfo])

  async function updateClubInfo() {
    if (!club_id) return
     try {
      setLoading(true)

      const { error } = await supabase.from('club_infos')
       .update({
        description,
        location,
        frequency,
        banquet,
        record,
        membership_fee,
        initial_cost,
        feeling_positive,
        feeling_negative
        })
        .eq('club_id', club_id)
      if (error) throw error
      alert('Club info updated!')
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
            <FieldLabel htmlFor="description">Description</FieldLabel>
            <Textarea
              id="description"
              value={description || ''}
              onChange={(e) => setDescription(e.target.value)}
            />
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
            <FieldLabel htmlFor="frequency">Frequency</FieldLabel>
            <Input
              id="frequency"
              type="text"
              value={frequency || ''}
              onChange={(e) => setFrequency(e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="banquet">Banquet</FieldLabel>
            <Input
              id="banquet"
              type="text"
              value={banquet || ''}
              onChange={(e) => setBanquet(e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="record">Record</FieldLabel>
            <Input
              id="record"
              type="text"
              value={record || ''}
              onChange={(e) => setRecord(e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="membership_fee">Membership Fee</FieldLabel>
            <Input
              id="membership_fee"
              type="text"
              value={membership_fee || ''}
              onChange={(e) => setMembershipFee(e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="initial_cost">Initial Cost</FieldLabel>
            <Input
              id="initial_cost"
              type="text"
              value={initial_cost || ''}
              onChange={(e) => setInitialCost(e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="feeling_positive">Feeling Positive</FieldLabel>
            <Textarea
              id="feeling_positive"
              value={feeling_positive || ''}
              onChange={(e) => setFeelingPositive(e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="feeling_negative">Feeling Negative</FieldLabel>
            <Textarea
              id="feeling_negative"
              value={feeling_negative || ''}
              onChange={(e) => setFeelingNegative(e.target.value)}
            />
          </Field>

          <Field>
            <Button
              type="button"
              className="button primary block"
              onClick={updateClubInfo}
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