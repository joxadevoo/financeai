'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Users, Mail, Sparkles, Heart, CheckCircle2, XCircle, Clock, Tag } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/useTranslation'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useFamilyStore } from '@/lib/store/useFamilyStore'
import { createClient } from '@/lib/supabase/client'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { FamilyStats } from '@/components/family/FamilyStats'

export default function FamilyPage() {
  const { language } = useTranslation()
  const { links, isLoading, fetchLinks, inviteMember, acceptInvite, removeLink, updateMemberTag } = useFamilyStore()
  const [email, setEmail] = useState('')
  const [adding, setAdding] = useState(false)
  const [myEmail, setMyEmail] = useState<string | null>(null)

  const tags = ['Otam', 'Onam', 'Turmush o\'rtog\'im', 'Akam', 'Ukam', 'Opam', 'Singlim', 'Farzandim']

  useEffect(() => {
    fetchLinks()
    createClient().auth.getUser().then(({ data }) => setMyEmail(data.user?.email || null))
  }, [fetchLinks])

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setAdding(true)
    await inviteMember(email)
    setEmail('')
    setAdding(false)
  }

  // Filter links
  const pendingReceived = links.filter(l => l.member_email === myEmail && l.status === 'pending')
  const pendingSent = links.filter(l => l.head_user_id !== null && l.member_email !== myEmail && l.status === 'pending') // Approx for now
  const activeMembers = links.filter(l => l.status === 'accepted')

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto space-y-8"
    >
      <div className="text-center space-y-4 pt-10 pb-6">
        <div className="inline-flex items-center justify-center p-4 bg-rose-100 dark:bg-rose-900/30 rounded-full mb-4">
          <Heart className="h-10 w-10 text-rose-500" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight">
          {language === 'uz' ? 'Oilaviy Byudjet' : 'Shared Wallets'}
          <span className="ml-2 inline-flex items-center rounded-full bg-blue-100 dark:bg-blue-900/30 px-3 py-1 text-xs font-semibold text-blue-800 dark:text-blue-300 align-middle">
            BETA
          </span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          {language === 'uz' 
            ? 'Birgalikda yig\'ing, birgalikda sarflang. Oila a\'zolaringizni yagona byudjetga taklif qiling.' 
            : 'Save together, spend together. Invite your family members to share a single budget.'}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mt-10">
        <div className="space-y-6">
          <Card className="border-rose-100 dark:border-rose-900/50 shadow-md">
            <CardHeader>
            <CardTitle className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
              <Sparkles className="h-5 w-5" />
              Premium Feature
            </CardTitle>
            <CardDescription>
              {language === 'uz' 
                ? 'Hozircha faqat premium a\'zolar va beta testchilari uchun yopiq jamoaviy hamyonlar tizimi. Taklifnoma yuborib joyingizni band qiling.' 
                : 'Currently in closed beta for premium members. Send an invite to reserve your spot.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleInvite} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {language === 'uz' ? 'Oila a\'zongiz e-maili' : 'Family Member Email'}
                </label>
                <div className="flex gap-2">
                  <Input 
                    type="email" 
                    placeholder="partner@example.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="flex-1"
                  />
                </div>
              </div>
              <Button type="submit" disabled={adding} className="w-full bg-rose-600 hover:bg-rose-700 text-white">
                <Mail className="w-4 h-4 mr-2" />
                {adding 
                  ? (language === 'uz' ? 'Yuborilmoqda...' : 'Sending...') 
                  : (language === 'uz' ? 'Taklif yuborish' : 'Send Invite')}
              </Button>
            </form>
          </CardContent>
        </Card>

        <FamilyStats />
      </div>

      <div className="space-y-6">
          {pendingReceived.length > 0 && (
            <Card className="border-amber-200 dark:border-amber-900/50 shadow-sm bg-amber-50/50 dark:bg-amber-900/10">
              <CardHeader className="pb-3">
                <CardTitle className="text-amber-600 flex items-center text-lg">
                  <Clock className="w-5 h-5 mr-2" />
                  {language === 'uz' ? 'Yangi taklifnomalar' : 'Pending Invites for You'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {pendingReceived.map(link => (
                  <div key={link.id} className="flex items-center justify-between bg-white dark:bg-neutral-900 p-3 rounded-lg shadow-sm border border-amber-100 dark:border-amber-900/30">
                    <span className="text-sm font-medium">Sizni oilaviy guruhga qo'shishmoqchi</span>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => acceptInvite(link.id)} className="bg-emerald-500 hover:bg-emerald-600 text-white h-8">
                        {language === 'uz' ? 'Qabul' : 'Accept'}
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => removeLink(link.id)} className="text-red-500 border-red-200 hover:bg-red-50 h-8">
                        Rad
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg">
                <Users className="w-5 h-5 mr-2 text-indigo-500" />
                {language === 'uz' ? 'Jamoa a\'zolari' : 'Team Members'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-2 rounded-md hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 font-bold text-xs uppercase">
                    {myEmail?.charAt(0) || 'ME'}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{myEmail}</p>
                    <p className="text-xs text-muted-foreground">Siz (You)</p>
                  </div>
                </div>
              </div>
              
              {activeMembers.map(link => (
                <div key={link.id} className="flex items-center justify-between p-2 rounded-md hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-600 font-bold text-xs uppercase">
                      {link.member_email.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{link.member_tag ? <span className="text-indigo-600 dark:text-indigo-400 mr-2 font-bold">{link.member_tag}</span> : null}{link.member_email}</p>
                      <p className="text-xs text-emerald-500 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> faol
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-neutral-400 hover:text-indigo-600">
                          <Tag className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuLabel>Rol berish (Tag)</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {tags.map(tag => (
                          <DropdownMenuItem key={tag} onClick={() => updateMemberTag(link.id, tag)}>
                            {tag}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <Button variant="ghost" size="icon" onClick={() => removeLink(link.id)} className="text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30">
                      <XCircle className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}

              {pendingSent.map(link => (
                <div key={link.id} className="flex items-center justify-between p-2 rounded-md hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors opacity-60">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-500 font-bold text-xs uppercase">
                      {link.member_email.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{link.member_email}</p>
                      <p className="text-xs text-amber-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> kutilmoqda
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => removeLink(link.id)} className="text-neutral-400 hover:text-red-500">
                    <XCircle className="w-4 h-4" />
                  </Button>
                </div>
              ))}

              {activeMembers.length === 0 && pendingSent.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">Boshqa a'zolar yo'q.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  )
}
