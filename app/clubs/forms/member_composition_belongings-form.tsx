'use client'
import { useCallback, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { MemberCompositionBelonging, Belonging } from '@/types/types'
import { Button } from '@/components/ui/button'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'

// helper component for editing a club record

export default function MemberCompositionBelongingsForm({ club_id, belongings }: { club_id: number | null, belongings: Belonging[] | null}) {
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [composition_belongings, setCompositionBelongings] = useState<MemberCompositionBelonging[] | null>(null)
  const [initialCompositionBelongings, setInitialCompositionBelongings] = useState<MemberCompositionBelonging[] | null>(null) // 差分更新のための初期状態

 const getMemberCompositionBelongings = useCallback(async () => {
    if (!club_id || !belongings) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('member_composition_belongings')
        .select(`id, club_id, belonging_id, headcount, created_at, updated_at`)
        .eq('club_id', club_id);

      if (error) {
        throw error;
      }

      // DBから取得したデータをMapに変換して高速にアクセスできるようにする
      const fetchedMap = new Map(data.map(item => [item.belonging_id, item]));
      
      // 全てのbelongingに対してデータオブジェクトを生成する
      const allCompositions = belongings.map(b => {
        return fetchedMap.get(b.id) || {
          id: 0, // 新規レコードのためIDは0
          club_id: club_id,
          belonging_id: b.id,
          headcount: null,
          created_at: '',
          updated_at: '',
        };
      });

      setCompositionBelongings(allCompositions);
      // 差分比較のため、初期状態をディープコピーして保存
      setInitialCompositionBelongings(JSON.parse(JSON.stringify(allCompositions)));

    } catch (error: any) {
      console.error('Error loading member composition data:', error);
      alert('Error loading member composition data!');
    } finally {
      setLoading(false);
    }
  }, [club_id, belongings, supabase]);

  useEffect(() => {
    getMemberCompositionBelongings()
  }, [getMemberCompositionBelongings])

  async function updateMemberCompositionBelongings() {
    if (!club_id || !composition_belongings) return;
    
    try {
      setLoading(true);

      // 初期状態と比較して変更があったレコードのみを抽出
      const changes = composition_belongings.filter(current => {
        const initial = initialCompositionBelongings?.find(
          init => init.belonging_id === current.belonging_id
        );
        return !initial || initial.headcount !== current.headcount;
      });

      if (changes.length === 0) {
        alert('No changes to save.');
        setLoading(false);
        return;
      }

      // upsert用のデータを作成
      const upsertData = changes.map(item => ({
        club_id: club_id,
        belonging_id: item.belonging_id,
        headcount: item.headcount,
      }));

      const { error } = await supabase.from('member_composition_belongings').upsert(upsertData, { onConflict: 'club_id,belonging_id' });

      if (error) throw error;

      alert('Member composition belongings updated!');
      // 更新成功後、データを再取得して状態を同期
      await getMemberCompositionBelongings();
    } catch (error: any) {
      console.error('updateMemberCompositionBelongings caught error', error)
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
          <div className="grid grid-cols-3 gap-4">
          {belongings && belongings.length > 0 ? (
            belongings.map((belonging) => {
              const belongingData = composition_belongings?.find((cb) => cb.belonging_id === belonging.id)
              return (
                <Field key={belonging.id}>
                  <FieldLabel htmlFor={`belonging-${belonging.id}`}>{belonging.name}</FieldLabel>
                  <Input
                    id={`belonging-${belonging.id}`}
                    type="number"
                    value={belongingData?.headcount ?? ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      // 入力が空の場合はnull、それ以外は数値に変換します。
                      const newHeadcount = value === '' ? null : parseInt(value, 10);

                      // 不正な数値入力（例: "abc"）の場合は更新をスキップします。
                      if (value !== '' && isNaN(newHeadcount!)) {
                        return;
                      }

                      setCompositionBelongings(prev => 
                        prev?.map(cb => 
                          cb.belonging_id === belonging.id ? { ...cb, headcount: newHeadcount } : cb
                        ) || null
                      );
                    }}
                  />
                </Field>
              )
            })
          ) : (
            <p className="col-span-3 text-sm text-center text-gray-500">表示する所属データがありません。</p>
          )}
          </div>
          
          <Field>
            <Button
              type="button"
              className="button primary block"
              onClick={updateMemberCompositionBelongings}
              disabled={loading || !belongings || belongings.length === 0}
            >
              {loading ? 'Loading ...' : 'Update'}
            </Button>
          </Field>
        </FieldGroup>
      </form>

      
    </div>
  )
}