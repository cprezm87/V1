import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function POST() {
  try {
    const supabase = createServerSupabaseClient()

    // Paso 1: Verificar si la tabla ya existe
    const { error: checkError } = await supabase.from("checklist_items").select("id").limit(1)

    // Si no hay error, la tabla ya existe
    if (!checkError) {
      return NextResponse.json({
        success: true,
        message: "La tabla checklist_items ya existe",
      })
    }

    // Si el error no es porque la tabla no existe, hay otro problema
    if (!checkError.message.includes("does not exist")) {
      return NextResponse.json({ success: false, error: checkError.message }, { status: 500 })
    }

    // La tabla no existe, vamos a crearla usando SQL directo
    // Usamos el cliente de administración de Supabase
    const { error: createError } = await supabase.rpc("postgres_command", {
      command: `
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
        `,
    })

    if (createError) {
      console.error("Error creating table with postgres_command:", createError)

      // Intentar un enfoque alternativo usando la API REST
      try {
        // Crear la tabla usando la API REST directamente
        const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/postgres_command`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
            Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY || ""}`,
            Prefer: "return=minimal",
          },
          body: JSON.stringify({
            command: `
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
            `,
          }),
        })

        if (!res.ok) {
          throw new Error(`Error en la API REST: ${res.statusText}`)
        }
      } catch (restError) {
        console.error("Error with REST API approach:", restError)
        return NextResponse.json(
          {
            success: false,
            error: "No se pudo crear la tabla. Por favor, crea la tabla manualmente desde la consola de Supabase.",
            details: createError.message,
          },
          { status: 500 },
        )
      }
    }

    // Verificar si la tabla se creó correctamente
    const { error: verifyError } = await supabase.from("checklist_items").select("id").limit(1)

    if (verifyError) {
      return NextResponse.json(
        {
          success: false,
          error: "No se pudo verificar la creación de la tabla. Por favor, verifica manualmente.",
          details: verifyError.message,
        },
        { status: 500 },
      )
    }

    // La tabla se creó correctamente
    return NextResponse.json({
      success: true,
      message: "La tabla checklist_items se ha creado correctamente",
    })
  } catch (error) {
    console.error("Error in create-tables API:", error)
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
