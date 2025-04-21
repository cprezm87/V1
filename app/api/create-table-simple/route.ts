import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function POST() {
  try {
    const supabase = createServerSupabaseClient()

    // Verificar si la tabla ya existe
    const { error: checkError } = await supabase.from("checklist_items").select("id").limit(1)

    // Si no hay error, la tabla ya existe
    if (!checkError) {
      return NextResponse.json({
        success: true,
        message: "La tabla checklist_items ya existe",
      })
    }

    // Intentar crear la tabla usando SQL
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
    `

    // Ejecutar SQL directamente
    const { error: createError } = await supabase.rpc("postgres_command", { command: createTableSQL })

    if (createError) {
      return NextResponse.json(
        {
          success: false,
          error: "No se pudo crear la tabla. Por favor, crea la tabla manualmente desde la consola de Supabase.",
          details: createError.message,
        },
        { status: 500 },
      )
    }

    // Configurar RLS y políticas
    const rlsSQL = `
      -- Configurar Row Level Security (RLS)
      ALTER TABLE checklist_items ENABLE ROW LEVEL SECURITY;
      
      -- Crear políticas para que los usuarios solo puedan ver y modificar sus propios items
      DROP POLICY IF EXISTS "Users can view their own checklist items" ON checklist_items;
      CREATE POLICY "Users can view their own checklist items" 
        ON checklist_items FOR SELECT 
        USING (auth.uid()::text = user_id OR user_id = 'default-user-id');
      
      DROP POLICY IF EXISTS "Users can insert their own checklist items" ON checklist_items;
      CREATE POLICY "Users can insert their own checklist items" 
        ON checklist_items FOR INSERT 
        WITH CHECK (auth.uid()::text = user_id OR user_id = 'default-user-id');
      
      DROP POLICY IF EXISTS "Users can update their own checklist items" ON checklist_items;
      CREATE POLICY "Users can update their own checklist items" 
        ON checklist_items FOR UPDATE 
        USING (auth.uid()::text = user_id OR user_id = 'default-user-id');
      
      DROP POLICY IF EXISTS "Users can delete their own checklist items" ON checklist_items;
      CREATE POLICY "Users can delete their own checklist items" 
        ON checklist_items FOR DELETE 
        USING (auth.uid()::text = user_id OR user_id = 'default-user-id');
    `

    // Ejecutar SQL para RLS y políticas
    const { error: rlsError } = await supabase.rpc("postgres_command", { command: rlsSQL })

    if (rlsError) {
      console.warn("Error setting up RLS and policies:", rlsError)
      // Continuamos aunque haya error en las políticas, ya que la tabla se creó correctamente
    }

    return NextResponse.json({
      success: true,
      message: "La tabla checklist_items se ha creado correctamente",
    })
  } catch (error) {
    console.error("Error in create-table-simple API:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Error interno del servidor. Por favor, intenta más tarde.",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
