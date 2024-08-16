import Image, { StaticImageData } from 'next/image';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

import AvatarPlaceholder from '@/assets/';
import LoadingButton from '@/components/loading-button';
import {
    Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle
} from '@/components/ui/dialog';
import {
    Form, FormControl, FormField, FormItem, FormLabel, FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { UserData } from '@/lib/types';
import { updateUserProfileSchema, UpdateUserProfileValues } from '@/lib/validation';
import { zodResolver } from '@hookform/resolvers/zod';

import { useUpdateProfileMutation } from './mutations';

interface EditProfileDialogProps {
  user: UserData;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EditProfileDialog({
  user,
  open,
  onOpenChange,
}: EditProfileDialogProps) {
  const [croppedAvatar, setCroppedAvatar] = useState<Blob | null>(null);

  const mutation = useUpdateProfileMutation();

  const form = useForm<UpdateUserProfileValues>({
    resolver: zodResolver(updateUserProfileSchema),
    defaultValues: {
      displayName: user.displayName,
      bio: user.bio || "",
    },
  });

  const onSubmit = async (values: UpdateUserProfileValues) => {
    mutation.mutate(
      {
        values,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
              </DialogHeader>
              <div className='space-y-1.5'>
                  <Label>Avatar</Label>
                  <AvatarInput src={} />
              </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="displayName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Display Name" type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us a little bit about yourself..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <LoadingButton type="submit" loading={mutation.isPending}>
                Save
              </LoadingButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

interface AvatarInputProps {
  src: string | StaticImageData;
  onImageCropped: (blob: Blob | null) => void;
}
function AvatarInput({ src, onImageCropped }: AvatarInputProps) {
  const [imageToCrop, setImageToCrop] = useState<File>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onImageSelected = (image: File | undefined) => {
    if (!image) return;

    return (
      <>
        <input
          type="file"
          accept="image/"
          onChange={(e) => onImageSelected(e.target.files?.[0])}
          ref={fileInputRef}
          className="sr-only hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="group relative block"
        >
          <Image
            src={src}
            alt="Avatar-preview"
            width={150}
            height={150}
            className="size-32 flex-none rounded-full object-cover"
          />
        </button>
      </>
    );
  };
}
