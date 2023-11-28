import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { stripe } from "@/lib/stripe";
import { absoluteUrl } from "@/lib/utils";
import { createOrRetrieveCustomer } from "@/lib/supabaseAdmin";

const settingsUrl = process.env.NEXT_PUBLIC_BASE_URL + "/settings";

export async function POST(request: Request) {
  const {
    price = "price_1OHZe4IfIPKRRCw85nMHO2Rv",
    quantity = 1,
    metadata = {},
  } = await request.json();

  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data } = await supabase.auth.getUser();

    const { user }: any = data;
    console.log(user);
    console.log(user.email);
    console.log(user.id);

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
      success_url: `${settingsUrl}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}`,
    });

    console.log(session);

    console.log("URL: " + session.url);

    return new NextResponse(JSON.stringify({ url: session.url }));
  } catch (error: any) {
    console.log(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
