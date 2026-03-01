import { supabase } from '../../../../lib/supabase';

export async function POST(request) {
  if (!supabase) {
    return Response.json({ error: 'Supabase not configured' }, { status: 500 });
  }

  const body = await request.json().catch(() => ({}));
  const name = (body.name || '').trim();
  const agent_id = (body.agent_id || '').trim();

  if (!name) {
    return Response.json({ error: 'Missing agent name' }, { status: 400 });
  }

  const { data: existing, error: fetchError } = await supabase
    .from('agents')
    .select('*')
    .eq('name', name)
    .limit(1)
    .maybeSingle();

  if (fetchError && fetchError.code !== 'PGRST116') {
    return Response.json({ error: fetchError.message }, { status: 400 });
  }

  if (existing) {
    return Response.json({ ok: true, agent: existing });
  }

  const payload = { name, agent_id: agent_id || name };
  const { data, error } = await supabase
    .from('agents')
    .insert([payload])
    .select()
    .single();

  if (error) {
    return Response.json({ error: error.message }, { status: 400 });
  }

  return Response.json({ ok: true, agent: data });
}
