"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card"
import { WaveIcon } from "../_components/wave-icon"
import { Label } from "@radix-ui/react-label"
import { Input } from "~/components/ui/input"
import Link from "next/link"
import { Button } from "~/components/ui/button"
import { useEffect, useState, type ChangeEvent } from "react"
import { useToast } from "~/hooks/use-toast"
import { useRouter } from "next/navigation"
import { api } from "~/trpc/react"

export default function LoginPage(){
    
    const [loginError , setLoginError] = useState<string>("") 

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const [errors,setErrors] = useState({
        email: "",
        password: ""
    });
    const router = useRouter();
    const { toast } = useToast();

    const handleChange = (e: ChangeEvent<HTMLInputElement>)  => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }))
        if(errors[name as keyof typeof errors]){
            setErrors((prev) => ({
                ...prev,
                [name]: ""
            }))
        }
    }
    const validateForm = () => {
        let valid = true
        const newErrors = { ...errors }
    
        if (!formData.email) {
          newErrors.email = "Email is required"
          valid = false
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
          newErrors.email = "Email is invalid"
          valid = false
        }
    
        if (!formData.password) {
          newErrors.password = "Password is required"
          valid = false
        }
    
        setErrors(newErrors)
        return valid
      }
    
    const { refetch } = api.user.getCurrentUser.useQuery();

    const { 
      mutate: loginMutation,
      data: loginData,
      isPending,
      error
    } = api.auth.signIn.useMutation({
        onSuccess(data, variables) {
            console.log("data",data)
            if(data === 'incorrect password'){
              setLoginError("Incorrect Password")
            }else if (data === 'user not found,unable to login'){
              setLoginError("User not found with the email")
            }else if(data === 'user logged in successfully'){
              refetch();
              toast({
                title: "Login successful",
                description: data
              })
              router.push("/")
              router.refresh()
            }
        },
        onError(error, variables) {
            console.log("error", error)
            toast({
              title: "Login failed",
              description: "Invalid email or password. Please try again.",
              variant: "destructive",
            })
        },
    })

      const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!validateForm()) return

        loginMutation({ 
          email: formData.email,
          password: formData.password
         })

         console.log(loginData);
      }

    return(
        <div className="container flex items-center justify-center min-h-[80vh]">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1 text-center">
                    <div className="flex justify-center mb-2">
                    <Link href="/">
                         <WaveIcon className="h-8 w-8 text-emerald-500" />
                    </Link>
                    </div>
                    <CardTitle className="text-2xl">Welcome back</CardTitle>
                    <CardDescription>Enter your credentials to sign in to your account</CardDescription>
                    {loginError && (
                      <CardDescription className="text-red-500 pt-3">{loginError}</CardDescription>
                    )}
                </CardHeader>
                <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="/forgot-password" className="text-sm text-emerald-600 hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? "border-red-500" : ""}
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col">
            <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={isPending}>
              {isPending ? "Signing in..." : "Sign in"}
            </Button>
            <p className="mt-4 text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-emerald-600 hover:underline">
                Sign up
              </Link>
            </p>
          </CardFooter>
        </form>
            </Card>
        </div>
    )
}