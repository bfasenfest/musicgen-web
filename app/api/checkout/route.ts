import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { stripe } from "@/lib/stripe";
import { absoluteUrl } from "@/lib/utils";
import { createOrRetrieveCustomer } from "@/lib/supabaseAdmin";

const settingsUrl = absoluteUrl("/settings");

export async function POST(request: Request) {
  const { price, quantity = 1, metadata = {} } = await request.json();

  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data } = await supabase.auth.getUser();

    const user: any = data;

    const customer = await createOrRetrieveCustomer({
      email: user!.email,
      uuid: user!.id,
    });

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      billing_address_collection: "auto",
      customer,
      allow_promotion_codes: true,
      line_items: [
        {
          price,
          quantity,
        },
      ],
      metadata,
      success_url: `${settingsUrl}?success=true`,
      cancel_url: `${absoluteUrl("/")}?canceled=true`,
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error: any) {
    console.log(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
