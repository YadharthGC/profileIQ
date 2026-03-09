import { useState } from 'react'
import SideBar from './sidebar'
import Chat from './chat'

export default function MainLayout() {
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null)
  const [selectedProfileName, setSelectedProfileName] = useState<string | null>(null)

  const handleSelectProfile = (profileId: string, name: string) => {
    setSelectedProfileId(profileId)
    setSelectedProfileName(name)
  }

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');`}</style>
      <div className="flex h-screen bg-[#0A0A0F] text-white overflow-hidden" style={{ fontFamily: 'DM Sans, sans-serif' }}>

        <div className="hidden sm:flex w-[260px] shrink-0 flex-col h-full">
          <SideBar
            onSelectProfile={handleSelectProfile}
            selectedProfileId={selectedProfileId}
          />
        </div>

        <Chat
          profileId={selectedProfileId}
          profileName={selectedProfileName}
        />

      </div>
    </>
  )
}