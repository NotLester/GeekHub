import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import LoginImage from '@/assets/login-image.jpg';

import GoogleSignInButton from './google/google-sign-in-button';
import LoginForm from './login-form';

export const metadata: Metadata = {
  title: "Log In",
};

export default function Page() {
  return (
    <main className="flex h-screen items-center justify-center p-5">
      <div className="flex h-full max-h-[40rem] w-full max-w-[64rem] overflow-hidden rounded-2xl bg-card shadow-2xl">
        <div className="w-full space-y-10 overflow-y-auto p-10 md:w-1/2">
          <h1 className="text-center text-3xl font-bold">Login to BugBook</h1>
          <div className="space-y-5">
            <GoogleSignInButton />
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-muted" />
              <span>OR</span>
              <div className="h-px flex-1 bg-muted" />
            </div>
            <LoginForm />
            <p className="block text-center">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="font-semibold text-green-700 hover:underline"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
        <Image
          src={LoginImage}
          alt="login-image"
          className="hidden w-1/2 object-cover md:block"
        />
      </div>
    </main>
  );
}
