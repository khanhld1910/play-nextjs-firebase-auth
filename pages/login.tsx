import React, {
  ChangeEventHandler,
  FormEventHandler,
  useCallback,
  useRef,
  useState
} from 'react'
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  GoogleAuthProvider,
  TwitterAuthProvider,
  fetchSignInMethodsForEmail,
  linkWithPopup,
  linkWithRedirect
} from 'firebase/auth'
import { useMediaQuery } from 'react-responsive'
import { auth } from '../lib/firebase'
import { AuthError, UserCredential } from 'firebase/auth'

function LoginPage() {
  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)

  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' })

  const login = useCallback(async () => {
    const email = emailRef.current?.value || ''
    const password = passwordRef.current?.value || ''
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    )

    const idToken = await userCredential.user.getIdToken()
    console.log({ idToken })
    // TODO: swap this idToken to get Cohart's accessToken
  }, [])

  const loginByGoogle = useCallback(async () => {
    const provider = new GoogleAuthProvider()
    const handler = isTabletOrMobile ? signInWithRedirect : signInWithPopup
    const userCredential = await handler(auth, provider)
    const idToken = await userCredential.user.getIdToken()
    console.log({ idToken })
    // TODO: swap this idToken to get Cohart's accessToken
  }, [isTabletOrMobile])

  const promptUserForPassword = useCallback(() => {
    const password = prompt(
      'Please type your password to link to an existed account:'
    )
    return password
  }, [])

  const loginByTwitter = useCallback(async () => {
    const provider = new TwitterAuthProvider()
    const handler = isTabletOrMobile ? signInWithRedirect : signInWithPopup
    const userCredential = await (async () => {
      try {
        const userCredential = await handler(auth, provider)
        return userCredential
      } catch (error) {
        const { code: errorCode, customData } = error as unknown as AuthError
        if (
          errorCode !== 'auth/account-exists-with-different-credential' ||
          !customData.email
        ) {
          throw error
        }

        const methods = await fetchSignInMethodsForEmail(auth, customData.email)
        console.log(methods)
        // If the user has several sign-in methods,
        // the first method in the list will be the "recommended" method to use.
        if (methods[0] === 'password') {
          // Asks the user their password.
          // In real scenario, you should handle this asynchronously.
          const password = promptUserForPassword() // TODO: implement promptUserForPassword.
          if (!password) throw 'User denied action!'
          const userCredential = await signInWithEmailAndPassword(
            auth,
            customData.email,
            password
          )

          const linkingHandler = true ? linkWithRedirect : linkWithPopup
          // Twitter account successfully linked to the existing Firebase user.
          const linkedUserCredential = await linkingHandler(
            userCredential.user,
            provider
          )

          return linkedUserCredential
        }
        throw 'Cannot'
      }
    })()

    const idToken = await userCredential.user.getIdToken()
    console.log({ idToken })
    // TODO: swap this idToken to get Cohart's accessToken
  }, [isTabletOrMobile, promptUserForPassword])

  return (
    <main className="container mx-auto my-8 flex-1">
      <h1 className="my-12 text-lg font-bold">Login Page</h1>
      <div className="w-full space-y-4">
        <div className="border w-[400px] mx-auto p-4 flex flex-col gap-4 text-center">
          <input
            placeholder="email"
            type="text"
            name="email"
            ref={emailRef}
            defaultValue="khanhld1910@gmail.com"
          />
          <input
            placeholder="password"
            type="password"
            name="password"
            defaultValue="Aa12345?z"
            ref={passwordRef}
          />
          <button className="p-2 border" onClick={login}>
            Login
          </button>
          or
          <button className="p-2 border bg-red-400" onClick={loginByGoogle}>
            Login by Google
          </button>
          or
          <button className="p-2 border bg-blue-400" onClick={loginByTwitter}>
            Login by Twitter
          </button>
        </div>
      </div>
    </main>
  )
}

export default LoginPage
