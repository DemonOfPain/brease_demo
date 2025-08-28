import React from 'react'
import Button from '../generic/Button'

const ThirdPartySignIn = () => {
  return (
    <div className="w-full flex flex-col items-center gap-5">
      {/* TODO: real google and apple sign in */}
      <Button
        variant="secondary"
        size="md"
        label="Continue with Google"
        navigateTo="#"
        hasArrow
        className="w-full justify-center"
      />
      <Button
        variant="secondary"
        size="md"
        label="Sign in with Apple"
        navigateTo="#"
        hasArrow
        className="w-full justify-center"
      />
    </div>
  )
}

export default ThirdPartySignIn
