// @ts-nocheck
// @ts-nocheck
import React from "react";
import { useState } from "react";
import { RefreshCw, Database, CircleCheck as CheckCircle, CircleAlert as AlertCircle } from "lucide-react";
import Card from "../components/Card";
import { supabase } from "../../../../lib/supabase/client";

const SettingsTab: React.FC = () => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [syncMessage, setSyncMessage] = useState('');

  const handleDatabaseSync = async () => {
    setIsSyncing(true);
    setSyncStatus('idle');
    setSyncMessage('');

    try {
      // Insert/update rental equipment data
      const equipmentData = [
        {
          title: "DJI Osmo Pocket 3 Creator Combo",
          subtitle: "Compact and capable 4K pocket gimbal camera.",
          category: "Camera",
          price: 100,
          images: ['https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcSoYt3SQZ4JdARHvsnt5YNwEcLOgCK3ChpttRQ11k2-aVn6OiYSfJq7Upf10YZUtSUsxy8FFVDNiyxYdGfzaU2lk6uvdPM5dsGQaoFwVRdQBPHn9qb82eu4ww'],
          features: ['1-Inch CMOS & 4K/120fps', '2-Inch Rotatable Screen', '3-Axis Gimbal Mechanical Stabilization'],
          video_url: 'https://www.youtube.com/embed/MZq_2OJ5kOo',
          status: 'Available' as const
        },
        {
          title: "Sony A7 IV",
          subtitle: "Mirrorless hybrid camera with image stabilization and lightning-fast autofocus.",
          category: "Camera",
          price: 700,
          images: ['https://www.japanphoto.no/imageserver/750/750/scale/p/japan/PIM_PROD/Sony/PIM1143909_Sony_1634709214767.jpg'],
          features: ['Newly developed back-illuminated 33 megapixel Exmor R sensor', '4K/60p video in super35 format'],
          video_url: 'https://www.youtube.com/embed/bUgOEDqhZVY',
          status: 'Available' as const
        },
        {
          title: "DJI MINI 4 PRO FLY MORE COMBO (DJI RC 2)",
          subtitle: "Professional drone with 4K HDR capabilities.",
          category: "Drone",
          price: 500,
          images: ['https://djioslo.no/Userfiles/Upload/images/Modules/Eshop/27473_31283_DJI-Mini-4-Pro-RC-2-2.jpeg'],
          features: ['Under 249g', '4K/60fps HDR True Vertical Shooting', 'Omnidirectional obstacle sensing'],
          video_url: 'https://www.youtube.com/embed/FaCKViuXd_I',
          status: 'Available' as const
        },
        {
          title: "Sony FE 28-70mm f/3.5-5.6 US",
          subtitle: "Lightweight, compact 35mm full-frame standard zoom lens.",
          category: "Lens",
          price: 150,
          images: ['https://www.sony.no/image/fd6df2f58083e52631a23154639f3571?fmt=pjpeg&wid=1014&hei=396&bgcolor=F1F5F9&bgc=F1F5F9'],
          features: ['Lightweight, compact 35mm full-frame standard zoom lens', '28-70mm zoom range and F3.5-5.6 aperture'],
          video_url: 'https://www.youtube.com/embed/x4ZZC5nqS0o',
          status: 'Available' as const
        },
        {
          title: "DJI MIC MINI",
          subtitle: "Carry Less, Capture More",
          category: "Audio",
          price: 30,
          images: ['https://djioslo.no/Userfiles/Upload/images/Modules/Eshop/31146_DJI-Mic-Mini-45-DJI-Mic-Mini-Transmitte(1).png'],
          features: ['Small, ultralight, discreet', 'High-quality sound with stable transmission'],
          video_url: 'https://www.youtube.com/embed/iBgZJJ-NBTs',
          status: 'Available' as const
        },
        {
          title: "Canon EOS 5D Mark II",
          subtitle: "Full Frame DSLR Camera",
          category: "Camera",
          price: 800,
          images: ['https://m.media-amazon.com/images/I/819GW4aelwL._AC_SL1500_.jpg'],
          features: ['21MP - Full frame CMOS Sensor', 'ISO 100 - 6400( expands to 50 - 25600)'],
          video_url: 'https://www.youtube.com/embed/y_34mvEZGx0',
          status: 'Available' as const
        }
      ];

      // Upsert equipment data
      const { error: equipmentError } = await supabase
        .from('rental_equipment')
        .upsert(equipmentData, { onConflict: 'title', ignoreDuplicates: false });

      if (equipmentError) throw equipmentError;

      // Insert job teams data
      const jobTeamsData = [
        { name: "Strategy & Planning Team", image_url: "https://images.pexels.com/photos/7490890/pexels-photo-7490890.jpeg" },
        { name: "Technology and Innovation Team", image_url: "https://images.pexels.com/photos/5239811/pexels-photo-5239811.jpeg" },
        { name: "Marketing Team", image_url: "https://images.pexels.com/photos/7691715/pexels-photo-7691715.jpeg" },
        { name: "Content & Production Team", image_url: "https://images.pexels.com/photos/12249084/pexels-photo-12249084.jpeg" }
      ];

      // Insert teams one by one to handle conflicts properly
      const teams: Array<{ id: string; name: string; image_url: string }> = [];
      for (const teamData of jobTeamsData) {
        const { data: existingTeam } = await supabase
          .from('job_teams')
          .select('*')
          .eq('name', teamData.name)
          .maybeSingle();

        if (existingTeam) {
          // Update existing team
          const { data: updatedTeam, error: updateError } = await supabase
            .from('job_teams')
            .update(teamData)
            .eq('id', existingTeam.id)
            .select()
            .single();
          if (updateError) throw updateError;
          if (updatedTeam) teams.push(updatedTeam);
        } else {
          // Insert new team
          const { data: newTeam, error: insertError } = await supabase
            .from('job_teams')
            .insert([teamData])
            .select()
            .single();
          if (insertError) throw insertError;
          if (newTeam) teams.push(newTeam);
        }
      }


      // Insert job positions for each team
      if (teams) {
        const positionsData = [
          // Strategy & Planning Team
          { name: "Brand Strategist", description: "Lead strategic initiatives and provide expert consultation to drive business growth and innovation.", team_id: teams.find(t => t.name === "Strategy & Planning Team")?.id },
          { name: "Advertising Specialist", description: "Analyze business processes and requirements to identify opportunities for improvement and optimization.", team_id: teams.find(t => t.name === "Strategy & Planning Team")?.id },
          { name: "Product Innovator", description: "Analyze business processes and requirements to identify opportunities for improvement and optimization.", team_id: teams.find(t => t.name === "Strategy & Planning Team")?.id },
          
          // Technology Team
          { name: "Software Developer/Engineer", description: "Build and maintain web applications using modern technologies and best practices.", team_id: teams.find(t => t.name === "Technology and Innovation Team")?.id },
          { name: "Cloud Architect/DevOps Engineer", description: "Create intuitive and engaging user experiences through thoughtful design and user research.", team_id: teams.find(t => t.name === "Technology and Innovation Team")?.id },
          { name: "Artificial Intelligence Specialist", description: "Focus on exploring, prototyping, and integrating cutting-edge technologies relevant to their clients' needs.", team_id: teams.find(t => t.name === "Technology and Innovation Team")?.id },
          
          // Marketing Team
          { name: "Digital Marketer", description: "Drive digital marketing campaigns and strategies to increase brand awareness and customer acquisition.", team_id: teams.find(t => t.name === "Marketing Team")?.id },
          { name: "Influencer / Brand Ambassador", description: "Builds visibility for clients by creating content that amplifies clients' brand campaigns and engages target audiences.", team_id: teams.find(t => t.name === "Marketing Team")?.id },
          { name: "Content Creator", description: "Produce engaging content across various platforms to connect with our audience and tell our story.", team_id: teams.find(t => t.name === "Marketing Team")?.id },
          
          // Content & Production Team
          { name: "Video Editor / Videographer", description: "Produces, edits and enhances video content to deliver polished, high-impact campaigns.", team_id: teams.find(t => t.name === "Content & Production Team")?.id },
          { name: "Photographer", description: "Product, lifestyle, and brand photography.", team_id: teams.find(t => t.name === "Content & Production Team")?.id },
          { name: "Graphic Designer", description: "Develop visual concepts and designs that communicate ideas and inspire audiences.", team_id: teams.find(t => t.name === "Content & Production Team")?.id },
          { name: "Motion Graphics Designer", description: "Produces animations and visuals for ads, social media and brand storytelling.", team_id: teams.find(t => t.name === "Content & Production Team")?.id }
        ].filter(pos => pos.team_id); // Only include positions with valid team_id

        // Insert positions one by one to handle conflicts properly
        for (const positionData of positionsData) {
          const { data: existingPosition } = await supabase
            .from('job_positions')
            .select('*')
            .eq('name', positionData.name)
            .eq('team_id', positionData.team_id)
            .maybeSingle();

          if (existingPosition) {
            // Update existing position
            const { error: updateError } = await supabase
              .from('job_positions')
              .update(positionData)
              .eq('id', existingPosition.id);
            if (updateError) throw updateError;
          } else {
            // Insert new position
            const { error: insertError } = await supabase
              .from('job_positions')
              .insert([positionData]);
            if (insertError) throw insertError;
          }
        }

      }

      setSyncStatus('success');
      setSyncMessage('Database successfully synced with fresh data!');
    } catch (error) {
      console.error('Database sync error:', error);
      setSyncStatus('error');
      setSyncMessage(`Sync failed: ${(error as Error).message}`);
    } finally {
      setIsSyncing(false);
      // Clear status after 5 seconds
      setTimeout(() => {
        setSyncStatus('idle');
        setSyncMessage('');
      }, 5000);
    }
  };

  return (
    <div className="space-y-6">
      <Card title="Database Management">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 className="font-semibold text-gray-900">Sync Database</h3>
              <p className="text-sm text-gray-600">Update database with latest equipment and job data</p>
            </div>
            <button
              onClick={handleDatabaseSync}
              disabled={isSyncing}
              className="flex items-center gap-2 bg-[#FF5722] text-white px-4 py-2 rounded-lg hover:bg-[#E64A19] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
              {isSyncing ? 'Syncing...' : 'Sync Now'}
            </button>
          </div>
          
          {syncStatus !== 'idle' && (
            <div className={`flex items-center gap-2 p-3 rounded-lg ${
              syncStatus === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            }`}>
              {syncStatus === 'success' ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <AlertCircle className="w-4 h-4" />
              )}
              <span className="text-sm">{syncMessage}</span>
            </div>
          )}
        </div>
      </Card>

      <Card title="Users & Roles (RBAC)">
        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-lg border p-3 text-sm">
            <div className="font-medium mb-2">Roles</div>
            <ul className="space-y-1">
              <li>Admin</li><li>Project Manager</li><li>Finance</li><li>Operations</li><li>Creative</li><li>Intern</li><li>Partner (portal)</li><li>Client (portal)</li>
            </ul>
          </div>
          <div className="rounded-lg border p-3 text-sm">
            <div className="font-medium mb-2">Permission Matrix</div>
            <div className="h-28 rounded-md bg-gray-100" />
            <div className="mt-2 text-xs text-gray-600">CRUD per module + portal scopes</div>
          </div>
        </div>
      </Card>

      <Card title="Security">
        <ul className="space-y-2 text-sm">
          <li className="rounded-lg border bg-gray-50 px-3 py-2">2FA, session timeout, login activity</li>
          <li className="rounded-lg border bg-gray-50 px-3 py-2">IP allowlist (optional), password policy</li>
        </ul>
      </Card>

      <Card title="Branding">
        <ul className="space-y-2 text-sm">
          <li className="rounded-lg border bg-gray-50 px-3 py-2">Logo, colors, email templates, legal footer</li>
          <li className="rounded-lg border bg-gray-50 px-3 py-2">Default portal theme</li>
        </ul>
      </Card>

      <Card title="Integrations">
        <ul className="space-y-2 text-sm">
          <li className="rounded-lg border bg-gray-50 px-3 py-2">Supabase (auth, DB, storage)</li>
          <li className="rounded-lg border bg-gray-50 px-3 py-2">Paystack (payments/links)</li>
          <li className="rounded-lg border bg-gray-50 px-3 py-2">Twilio (SMS)</li>
          <li className="rounded-lg border bg-gray-50 px-3 py-2">Google Calendar/Outlook (scheduling)</li>
          <li className="rounded-lg border bg-gray-50 px-3 py-2">Google Drive/Dropbox (assets)</li>
        </ul>
      </Card>

      <Card title="Notifications & Automations">
        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-lg border p-3 text-sm">
            <div className="font-medium mb-1">System</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>Overdue invoices, deadlines, equipment overdue/maintenance</li>
              <li>Applicant pending, agreement expiring</li>
            </ul>
          </div>
          <div className="rounded-lg border p-3 text-sm">
            <div className="font-medium mb-1">Stakeholders</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>Client: project updates, milestones, invoices</li>
              <li>Partner: renewals, briefs, assets</li>
              <li>Team: assignments, conflicts, daily agenda</li>
            </ul>
          </div>
        </div>
        <div className="mt-2 text-xs text-gray-600">Channels: In-app, Email, (optional) SMS/WhatsApp for critical items.</div>
      </Card>

      <Card title="Metrics That Matter">
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 text-sm">
          <div className="rounded-lg border p-3"><div className="font-medium mb-1">Client</div><ul className="list-disc pl-5 space-y-1"><li>Retention, response time, project count, service mix</li></ul></div>
          <div className="rounded-lg border p-3"><div className="font-medium mb-1">Projects</div><ul className="list-disc pl-5 space-y-1"><li>On-time delivery %, revisions per deliverable, throughput</li></ul></div>
          <div className="rounded-lg border p-3"><div className="font-medium mb-1">Teams</div><ul className="list-disc pl-5 space-y-1"><li>Utilization, capacity gaps, on-time milestone rate</li></ul></div>
          <div className="rounded-lg border p-3"><div className="font-medium mb-1">Equipment</div><ul className="list-disc pl-5 space-y-1"><li>Utilization %, overdue %, maintenance cycles, ROI per item</li></ul></div>
          <div className="rounded-lg border p-3"><div className="font-medium mb-1">Partners</div><ul className="list-disc pl-5 space-y-1"><li>Referrals count, conversion, revenue influence, engagement aging</li></ul></div>
        </div>
      </Card>
    </div>
  );
};

export default SettingsTab;
