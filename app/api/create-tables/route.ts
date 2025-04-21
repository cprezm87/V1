import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function POST() {
  try {
    const supabase = createServerSupabaseClient()

    // Script SQL para crear la tabla checklist_items
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS checklist_items (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id TEXT NOT NULL,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        franchise TEXT NOT NULL,
        brand TEXT NOT NULL,
        serie TEXT,
        year_released TEXT,
        condition TEXT,
        price NUMERIC,
        year_purchase TEXT,
        upc TEXT,
        logo TEXT,
        photo TEXT,
        tagline TEXT,
        review TEXT,
        shelf TEXT,
        display TEXT,
        ranking INTEGER,
        comments TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      
      -- Crear índice para mejorar el rendimiento
      CREATE INDEX IF NOT EXISTS checklist_items_user_id_idx ON checklist_items(user_id);
      
      -- Configurar Row Level Security (RLS)
      ALTER TABLE checklist_items ENABLE ROW LEVEL SECURITY;
      
      -- Crear políticas para que los usuarios solo puedan ver y modificar sus propios items
      CREATE POLICY "Users can view their own checklist items" 
        ON checklist_items FOR SELECT 
        USING (auth.uid() = user_id);
      
      CREATE POLICY "Users can insert their own checklist items" 
        ON checklist_items FOR INSERT 
        WITH CHECK (auth.uid() = user_id);
      
      CREATE POLICY "Users can update their own checklist items" 
        ON checklist_items FOR UPDATE 
        USING (auth.uid() = user_id);
      
      CREATE POLICY "Users can delete their own checklist items" 
        ON checklist_items FOR DELETE 
        USING (auth.uid() = user_id);
    `

    // Ejecutar el script SQL
    const { error } = await supabase.rpc("exec_sql", { sql: createTableSQL })

    if (error) {
      console.error("Error creating tables:", error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "Tables created successfully" })
  } catch (error) {
    console.error("Error in create-tables API:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
