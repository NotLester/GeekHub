"use client";

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';

import LoadingButton from '@/components/loading-button';
import { PasswordInput } from '@/components/password-input';
import {
    Form, FormControl, FormField, FormItem, FormLabel, FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { loginSchema, LoginValues } from '@/lib/validation';
import { zodResolver } from '@hookform/resolvers/zod';

import { login } from './actions';

export default function LoginForm() {
  const [error, setError] = useState<string>();
  const [isPending, startTransition] = useTransition();

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginValues) => {
    setError(undefined);
    startTransition(async () => {
      const { error } = await login(values);
      if (error) {
        setError(error);
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        {error && <p className="text-center text-destructive">{error}</p>}
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Username" type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder="Password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <LoadingButton loading={isPending} type="submit" className="w-full">
          Create account
        </LoadingButton>
      </form>
    </Form>
  );
}
