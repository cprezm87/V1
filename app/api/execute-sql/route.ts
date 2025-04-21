import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function POST(request: Request) {
  try {
    const { sql } = await request.json()

    if (!sql) {
      return NextResponse.json({ success: false, error: "No SQL provided" }, { status: 400 })
    }

    const supabase = createServerSupabaseClient()

    // Ejecutar el comando SQL
    const { data, error } = await supabase.rpc("exec_sql", { sql })

    if (error) {
      console.error("Error executing SQL:", error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Error in execute-sql API:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
