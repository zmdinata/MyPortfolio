import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { getLocalProfileConfig } from '../lib/profileConfig';

/**
 * usePortfolioContext
 * Hook real-time untuk menyuplai knowledge base portofolio ke Agent-Z.
 * Fitur:
 * - Real-time Supabase subscription: otomatis refresh saat admin mengubah data di database.
 * - Event listener 'portfolio-cache-invalidated' & 'profile-updated'.
 * - Format High-Density Compact: hemat token hingga ~60%, detail lengkap, bebas token bloating.
 * - Tone natural: status ketersediaan diubah menjadi fakta kontekstual tanpa pemaksaan CTA kaku.
 */
export function usePortfolioContext() {
  const [contextString, setContextString] = useState('');
  const [rawContext, setRawContext] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const isFetchingRef = useRef(false);

  const fetchAllData = useCallback(async () => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;

    try {
      setIsLoading(true);

      const [
        { data: profile },
        { data: experiences },
        { data: education },
        { data: skills },
        { data: projects },
        { data: certificates },
        { data: honors }
      ] = await Promise.all([
        supabase.from('profile').select('*').eq('id', 1).maybeSingle(),
        supabase.from('experience').select('*').order('date_start', { ascending: false }),
        supabase.from('education').select('*').order('date_start', { ascending: false }),
        supabase.from('skills').select('*').order('name', { ascending: true }),
        supabase.from('projects').select('*').order('sort_order', { ascending: true }),
        supabase.from('certificates').select('*').order('sort_order', { ascending: true }),
        supabase.from('honors').select('*').order('sort_order', { ascending: true })
      ]);

      const localProfile = getLocalProfileConfig();
      const activeProfile = profile || localProfile || {};

      // Simpan raw data untuk kebutuhan frontend jika diperlukan
      setRawContext({
        profile: activeProfile,
        experiences: experiences || [],
        education: education || [],
        skills: skills || [],
        projects: projects || [],
        certificates: certificates || [],
        honors: honors || []
      });

      // ==============================================================
      // High-Density Structured Context (Hemat Token & Kaya Informasi)
      // ==============================================================
      const lines = [];

      // 1. Profil & Kontak
      const name = activeProfile.full_name || 'Zacky Muhammad Dinata';
      const role = activeProfile.hero_description_id || activeProfile.hero_description_en || 'AI Engineer & Multi-Agent Orchestrator';
      const bio = activeProfile.about_description_id || activeProfile.about_description_en || 'Spesialis AI engineering, kuantitatif risk system, dan multi-agent.';
      const isAvailable = activeProfile.available_for_hire ?? true;

      lines.push(`[PROFIL]`);
      lines.push(`Nama: ${name}`);
      lines.push(`Fokus: ${role}`);
      lines.push(`Ringkasan: ${bio}`);
      lines.push(`Kontak: Email: zmdinata@gmail.com | LinkedIn: https://www.linkedin.com/in/zacky-muhammad-dinata-463995280 | GitHub: https://github.com/zmdinata`);
      lines.push(`Status Ketersediaan: ${isAvailable ? 'Terbuka untuk peluang kerja (Full-time, Contract, AI Projects & Collaboration)' : 'Sedang tidak mencari peluang baru'}`);
      lines.push('');

      // 2. Keahlian (Skills) - Dikelompokkan per Kategori agar Padat & Terstruktur
      if (skills && skills.length > 0) {
        lines.push(`[KEAHLIAN]`);
        const skillCategories = {};
        skills.forEach(s => {
          const cat = s.category || 'Teknis & AI';
          if (!skillCategories[cat]) skillCategories[cat] = [];
          skillCategories[cat].push(s.name || s.title || s.id);
        });

        Object.entries(skillCategories).forEach(([cat, list]) => {
          lines.push(`- ${cat}: ${list.join(', ')}`);
        });
        lines.push('');
      }

      // 3. Proyek Aktif (Semua proyek aktif dengan Tech Stack & Link)
      if (projects && projects.length > 0) {
        lines.push(`[DAFTAR PROYEK]`);
        projects.forEach(p => {
          const title = p.title_id || p.title_en || 'Project';
          const desc = p.description_id || p.description_en || '';
          const tech = Array.isArray(p.tech_stack) ? p.tech_stack.join(', ') : (p.tech_stack || '');
          const link = p.live_url || p.github_url || '';
          lines.push(`- ${title}${tech ? ` (${tech})` : ''}: ${desc}${link ? ` [Link: ${link}]` : ''}`);
        });
        lines.push('');
      }

      // 4. Pengalaman Kerja
      if (experiences && experiences.length > 0) {
        lines.push(`[PENGALAMAN KERJA]`);
        experiences.forEach(e => {
          const roleTitle = e.role_id || e.role_en;
          const company = e.company_id || e.company_en;
          const period = `${e.date_start} - ${e.date_end || 'Sekarang'}`;
          const type = e.work_type ? ` (${e.work_type})` : '';
          const desc = e.description_id || e.description_en || '';
          lines.push(`- ${roleTitle} @ ${company} [${period}${type}]: ${desc}`);
        });
        lines.push('');
      }

      // 5. Pendidikan
      if (education && education.length > 0) {
        lines.push(`[PENDIDIKAN]`);
        education.forEach(edu => {
          const degree = edu.level_id || edu.level_en || '';
          const major = edu.major_id || edu.major_en || '';
          const grade = edu.grade_value && edu.grade_type !== 'None' ? `, ${edu.grade_type}: ${edu.grade_value}` : '';
          lines.push(`- ${edu.school} (${edu.date_start} - ${edu.date_end || 'Sekarang'}): ${degree} ${major}${grade}`);
        });
        lines.push('');
      }

      // 6. Sertifikasi & Penghargaan
      if (certificates && certificates.length > 0) {
        lines.push(`[SERTIFIKASI]`);
        certificates.slice(0, 8).forEach(c => {
          const title = c.title_id || c.title_en;
          const issuer = c.issuer_id || c.issuer_en;
          const meta = [issuer, c.date].filter(Boolean).join(', ');
          lines.push(`- ${title}${meta ? ` (${meta})` : ''}`);
        });
        lines.push('');
      }

      if (honors && honors.length > 0) {
        lines.push(`[PENGHARGAAN]`);
        honors.slice(0, 4).forEach(h => {
          const title = h.title_id || h.title_en;
          const issuer = h.issuer_id || h.issuer_en;
          const meta = [issuer, h.year].filter(Boolean).join(', ');
          lines.push(`- ${title}${meta ? ` (${meta})` : ''}`);
        });
        lines.push('');
      }

      setContextString(lines.join('\n').trim());
    } catch (error) {
      console.warn('[usePortfolioContext] Gagal sinkronisasi data Supabase, fallback aktif:', error);
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  }, []);

  // Inisialisasi awal + Listener Realtime & Event Bus
  useEffect(() => {
    fetchAllData();

    // 1. Supabase Realtime Subscription untuk mendeteksi perubahan seketika dari admin panel
    const realtimeChannel = supabase
      .channel('realtime-portfolio-context-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public' },
        () => {
          fetchAllData();
        }
      )
      .subscribe();

    // 2. Window Custom Events dari aksi admin di tab yang sama
    const handleInvalidate = () => {
      fetchAllData();
    };

    window.addEventListener('portfolio-cache-invalidated', handleInvalidate);
    window.addEventListener('profile-updated', handleInvalidate);

    return () => {
      supabase.removeChannel(realtimeChannel);
      window.removeEventListener('portfolio-cache-invalidated', handleInvalidate);
      window.removeEventListener('profile-updated', handleInvalidate);
    };
  }, [fetchAllData]);

  return {
    contextString,
    rawContext,
    isLoading,
    refreshContext: fetchAllData
  };
}
