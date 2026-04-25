import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function usePortfolioContext() {
  const [contextString, setContextString] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setIsLoading(true);

        // Fetch Profil
        const { data: profile } = await supabase.from('profile').select('*').eq('id', 1).single();
        
        // Fetch Pengalaman
        const { data: experiences } = await supabase.from('experience').select('*').order('year', { ascending: false });
        
        // Fetch Pendidikan
        const { data: education } = await supabase.from('education').select('*').order('year_start', { ascending: false });
        
        // Fetch Skills
        const { data: skills } = await supabase.from('skills').select('*').order('name', { ascending: true });
        
        // Fetch Proyek
        const { data: projects } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
        
        // Fetch Sertifikasi
        const { data: certificates } = await supabase.from('certificates').select('*').order('year', { ascending: false });

        // Build context string
        let context = "";

        if (profile) {
          context += `[PROFIL]\nNama: Zacky Muhammad Dinata\n`;
          context += `Deskripsi: ${profile.about_description_id || profile.about_description_en || '-'}\n`;
          context += `Email: zmdinata@gmail.com\n`;
          context += `LinkedIn: https://www.linkedin.com/in/zacky-muhammad-dinata-463995280\n`;
          context += `GitHub: https://github.com/zmdinata\n`;
          
          if (profile.available_for_hire) {
            context += `[KETERSEDIAAN] Status: Tersedia untuk direkrut (Available for hire). INSTRUKSI KHUSUS UNTUKMU: Karena Z. M. Dinata sedang tersedia, kamu HARUS mengajak pengunjung (CTA) untuk merekrut, menawarkan proyek, atau menghubungi Z. M. Dinata untuk peluang kerja pada respons pertamamu dan saat relevan.\n\n`;
          } else {
            context += `[KETERSEDIAAN] Status: Sedang tidak mencari peluang kerja baru (Not available for hire).\n\n`;
          }
        }

        if (skills && skills.length > 0) {
          context += `[KEAHLIAN (SKILLS)]\n`;
          context += skills.map(s => `- ${s.name}: ${s.description_id || s.description_en}`).join('\n') + '\n\n';
        }

        if (experiences && experiences.length > 0) {
          context += `[PENGALAMAN KERJA]\n`;
          context += experiences.slice(0, 3).map(e => 
            `- ${e.role_id || e.role_en} di ${e.company_id || e.company_en} (${e.date_start} sampai ${e.date_end || 'Sekarang'}).\n  Deskripsi: ${e.description_id || e.description_en}`
          ).join('\n\n') + '\n\n';
        }

        if (education && education.length > 0) {
          context += `[PENDIDIKAN]\n`;
          context += education.slice(0, 2).map(e => 
            `- ${e.school} (${e.date_start} sampai ${e.date_end || 'Sekarang'}). Jurusan: ${e.major_id || e.major_en}. Gelar: ${e.level_id || e.level_en}.`
          ).join('\n') + '\n\n';
        }

        if (projects && projects.length > 0) {
          context += `[PROYEK]\n`;
          context += projects.slice(0, 3).map(p => 
            `- ${p.title_id || p.title_en}: ${p.description_id || p.description_en}. Teknologi: ${p.tech_stack?.join(', ')}.`
          ).join('\n') + '\n\n';
        }

        if (certificates && certificates.length > 0) {
          context += `[SERTIFIKASI]\n`;
          context += certificates.slice(0, 4).map(c => 
            `- ${c.title_id || c.title_en} dari ${c.issuer_id || c.issuer_en} (${c.date}).`
          ).join('\n') + '\n\n';
        }

        setContextString(context);
      } catch (error) {
        console.error("Gagal mengambil data portfolio untuk AI:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, []);

  return { contextString, isLoading };
}
