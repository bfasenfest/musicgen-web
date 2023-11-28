import { stripe } from "@/lib/stripe";

import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { absoluteUrl } from "@/lib/utils";
import { createOrRetrieveCustomer } from "@/lib/supabaseAdmin";

const settingsUrl = process.env.NEXT_PUBLIC_BASE_URL + "/settings";

export async function GET(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data } = await supabase.auth.getUser();

    if (!data) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user: any = data.user;

    console.log(user);
    if (!user) throw Error("Could not get user");

    const customer = await createOrRetrieveCustomer({
      email: user!.email,
      uuid: user!.id,
    });

    console.log(customer);

    const { url } = await stripe.billingPortal.sessions.create({
      customer,
      return_url: settingsUrl,
    });

    return NextResponse.json({ url });
  } catch (error: any) {
    console.log(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
