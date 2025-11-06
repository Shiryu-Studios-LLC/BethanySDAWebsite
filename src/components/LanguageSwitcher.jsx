import { useEffect } from 'react'

export default function LanguageSwitcher() {
  useEffect(() => {
    // Load Google Translate script
    const addScript = () => {
      if (document.getElementById('google-translate-script')) return

      const script = document.createElement('script')
      script.id = 'google-translate-script'
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
      script.async = true
      document.body.appendChild(script)
    }

    // Initialize Google Translate
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: 'en',
          includedLanguages: 'en,ht,fr,es,pt', // English, Haitian Creole, French, Spanish, Portuguese
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false
        },
        'google_translate_element'
      )
    }

    addScript()
  }, [])

  return (
    <div
      id="google_translate_element"
      style={{
        display: 'inline-block'
      }}
    />
  )
}
