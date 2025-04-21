import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function POST() {
  try {
    const supabase = createServerSupabaseClient()

    // Paso 1: Crear la tabla checklist_items si no existe
    const { error: createTableError } = await supabase
      .from("checklist_items")
      .select("id")
      .limit(1)
      .catch(() => {
        // La tabla no existe, vamos a crearla
        return { error: { message: "Table does not exist" } }
      })

    if (createTableError && createTableError.message.includes("does not exist")) {
      // Crear la tabla usando la API REST de Supabase
      const { error } = await supabase.rpc("create_table", {
        table_name: "checklist_items",
        definition: `
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
        `,
      })

      if (error) {
        console.error("Error creating table:", error)

        // Si falla el método RPC, intentemos con un enfoque alternativo
        // Usando la API REST directamente
        const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
            Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY || ""}`,
          },
          body: JSON.stringify({
            query: `
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
          return NextResponse.json(
            {
              success: false,
              error: "No se pudo crear la tabla. Por favor, crea la tabla manualmente desde la consola de Supabase.",
            },
            { status: 500 },
          )
        }
      }
    } else if (createTableError && !createTableError.message.includes("does not exist")) {
      // Hay un error diferente al de "la tabla no existe"
      return NextResponse.json({ success: false, error: createTableError.message }, { status: 500 })
    }

    // La tabla ya existe o se creó correctamente
    return NextResponse.json({
      success: true,
      message: "La tabla checklist_items está lista para usar",
    })
  } catch (error) {
    console.error("Error in create-tables API:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Error interno del servidor. Por favor, intenta más tarde.",
      },
      { status: 500 },
    )
  }
}
