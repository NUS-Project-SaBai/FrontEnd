'use client';
import { Button } from '@/components/Button';
import { APP_CONFIG } from '@/config';
import { RHFInputField } from '@/components/inputs/RHFInputField';
import { axiosClientInstance } from '@/lib/axiosClientInstance';
import { User } from '@/types/User';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';

export default function LoginPage() {
  const useFormReturn = useForm();
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-[url('/cambodia.jpg')] bg-cover bg-center">
      <div className="flex flex-col items-center gap-2 rounded-lg bg-white p-28 shadow-md">
        <Image src="/sabaiLogo.png" alt="Sabai Logo" width={50} height={50} />
        <h1>Welcome!</h1>
        <FormProvider {...useFormReturn}>
          <form
            className="flex flex-col gap-2"
            onSubmit={useFormReturn.handleSubmit(data => {
              axiosClientInstance
                .post('/login/', {
                  emailOrUsername: data.emailOrUsername,
                })
                .then(response => {
                  toast.success('Login successful! Redirecting...');
                  const user: User = response.data.user;
                  // Set cookie with proper flags
                  document.cookie = `offlineUser=${user.id}; path=/; max-age=${60 * 60 * 24}; SameSite=Lax${APP_CONFIG.IS_PROD ? '; Secure' : ''}`;
                  window.localStorage.setItem('offlineUsername', user.username);
                  window.localStorage.setItem('offlineNickname', user.email);
                  router.replace('/');
                })
                .catch(error => {
                  toast.error(error.response.data.error);
                });
            })}
          >
            <RHFInputField
              name="emailOrUsername"
              label="Email / Username"
              type="text"
            />
            <Button
              type="submit"
              className="w-full"
              text="Login"
              colour="indigo"
              variant="solid"
            />
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
