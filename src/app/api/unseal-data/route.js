import Iron from '@hapi/iron';
import { NextResponse } from 'next/server';

const cookieSecret = process.env.COOKIE_SECRET;

export async function POST(req) {
    try {
        const {sealed} = await req.json();
        const unsealed = await Iron.unseal(sealed, cookieSecret, Iron.defaults);
        return NextResponse.json({status: 'success', data: unsealed});
        
    } catch (error) {
        console.log(error);
        return NextResponse.json({status: 'error', error}, {status: 500});
    }
}