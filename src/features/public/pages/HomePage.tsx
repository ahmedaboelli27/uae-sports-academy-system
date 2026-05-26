import type { LucideIcon } from 'lucide-react';
import {
  ArrowRight,
  Award,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock,
  CreditCard,
  Dumbbell,
  Facebook,
  Globe2,
  Instagram,
  MapPin,
  Medal,
  MessageCircle,
  Music2,
  Sparkles,
  Trophy,
  Users,
  Waves,
} from 'lucide-react';
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

interface ProgramItem {
  title: string;
  age: string;
  level: string;
  description: string;
  icon: LucideIcon;
  image: string;
}

interface FeatureItem {
  title: string;
  description: string;
  icon: LucideIcon;
}

interface SocialItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

const heroImage =
  'https://images.unsplash.com/photo-1526232761682-d26e03ac148e?auto=format&fit=crop&w=2400&q=90';

const trainingImages = [
  'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1547347298-4074fc3086f0?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1519311965067-36d3e5f33d39?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1200&q=85',
];

export default function HomePage() {
  const { i18n } = useTranslation();
  const isArabic = i18n.language?.startsWith('ar');

  const content = useMemo(() => {
    if (isArabic) {
      return {
        common: {
          viewProgram: 'عرض البرنامج',
          trainingDays: 'أيام التدريب',
          supportHours: 'الدعم اليومي: 9 صباحًا - 9 مساءً',
        },
        hero: {
          badge: 'أكاديمية رياضية متكاملة في الإمارات',
          title: 'نصنع أبطال الغد من خلال تدريب رياضي احترافي وتجربة رقمية ذكية',
          description:
            'منصة رياضية متكاملة تجمع بين التدريب عالي الجودة، متابعة الحضور، الاشتراكات، المدفوعات، تقارير الأداء، وتجربة سهلة لأولياء الأمور والمدربين والإدارة.',
          primary: 'احجز تجربة مجانية',
          secondary: 'استكشف البرامج',
          trust: 'موثوق بها من العائلات واللاعبين في أكثر من فرع',
          metricTitle: 'منظومة تشغيل ذكية',
          metricSubtitle: 'Academy Control',
          growth: 'نمو شهري',
          pathway: 'مسار اللاعب',
          pathwayText: 'مهارات • تقارير • تطور',
        },
        kpis: [
          { value: '1,200+', label: 'لاعب نشط' },
          { value: '35+', label: 'مدرب محترف' },
          { value: '8', label: 'فروع تدريب' },
          { value: '94%', label: 'رضا أولياء الأمور' },
        ],
        about: {
          eyebrow: 'من نحن',
          title: 'أكاديمية تجمع بين التدريب الرياضي والانضباط والمتابعة الذكية',
          description:
            'نساعد الأطفال والناشئين على تطوير مهاراتهم الرياضية والبدنية والسلوكية داخل بيئة آمنة ومنظمة، مع متابعة مستمرة لكل لاعب وربط واضح بين المدرب وولي الأمر والإدارة.',
          points: [
            'خطط تدريب مناسبة للعمر والمستوى',
            'متابعة حضور وتقدم اللاعبين',
            'تجربة رقمية سهلة لأولياء الأمور',
            'إدارة مالية وتنظيمية واضحة',
          ],
        },
        programsHeader: {
          eyebrow: 'برامجنا الرياضية',
          title: 'برامج متنوعة تناسب كل لاعب وكل مرحلة عمرية',
          description:
            'اختر البرنامج المناسب لطفلك من بين برامج كرة القدم، السباحة، كرة السلة، وبرامج اللياقة والحركة.',
        },
        programs: [
          {
            title: 'برنامج كرة القدم',
            age: 'من 5 إلى 16 سنة',
            level: 'مبتدئ إلى متقدم',
            description:
              'تدريب مهاري وتكتيكي متدرج يشمل التحكم بالكرة، التمرير، التسديد، اللياقة، والعمل الجماعي.',
            icon: Trophy,
            image: trainingImages[0],
          },
          {
            title: 'برنامج السباحة',
            age: 'من 4 إلى 14 سنة',
            level: 'أساسي إلى محترف',
            description:
              'تدريبات آمنة لتحسين الثقة في الماء، تقنيات السباحة، التنفس، والتحمل البدني.',
            icon: Waves,
            image: trainingImages[1],
          },
          {
            title: 'برنامج كرة السلة',
            age: 'من 7 إلى 16 سنة',
            level: 'مبتدئ إلى تنافسي',
            description:
              'تطوير المهارات الحركية، التصويب، المراوغة، الدفاع، وفهم اللعب الجماعي داخل الملعب.',
            icon: Dumbbell,
            image: trainingImages[2],
          },
        ],
        why: {
          eyebrow: 'لماذا تختارنا؟',
          title: 'نظام تدريبي وإداري واضح من أول حصة حتى الاحتراف',
          description:
            'الأكاديمية لا تقدم تدريبًا فقط، بل تقدم تجربة كاملة تشمل التخطيط، المتابعة، التقارير، التواصل، وتنظيم المدفوعات والاشتراكات.',
        },
        features: [
          {
            title: 'متابعة ذكية للاعبين',
            description:
              'تتبع الحضور، المستوى، الملاحظات، وتطور المهارات بوضوح لكل لاعب.',
            icon: Users,
          },
          {
            title: 'جداول تدريب منظمة',
            description:
              'إدارة الحصص، المدربين، الفروع، والطاقة الاستيعابية بطريقة سهلة.',
            icon: CalendarDays,
          },
          {
            title: 'إدارة مالية واضحة',
            description:
              'اشتراكات، فواتير، مدفوعات، مستحقات، وتقارير مالية في مكان واحد.',
            icon: CreditCard,
          },
          {
            title: 'تقارير أداء للإدارة',
            description:
              'لوحات مؤشرات تساعد الإدارة على اتخاذ قرارات أسرع وأكثر دقة.',
            icon: BarChart3,
          },
        ],
        galleryHeader: {
          eyebrow: 'من داخل التدريبات',
          title: 'صور افتراضية من أجواء الأكاديمية',
          description:
            'هذه صور تجريبية يمكنك استبدال روابطها لاحقًا بصور حقيقية من تدريبات الأكاديمية.',
        },
        gallery: [
          {
            title: 'تدريبات جماعية',
            subtitle: 'روح الفريق والانضباط داخل الملعب',
            image: trainingImages[0],
          },
          {
            title: 'تطوير المهارات',
            subtitle: 'تمارين مناسبة لكل مستوى',
            image: trainingImages[1],
          },
          {
            title: 'حصص احترافية',
            subtitle: 'مدربون متخصصون وخطط واضحة',
            image: trainingImages[2],
          },
          {
            title: 'بيئة آمنة',
            subtitle: 'متابعة مستمرة وتجربة مريحة للعائلة',
            image: trainingImages[3],
          },
        ],
        journey: {
          eyebrow: 'رحلة اللاعب',
          title: 'من التسجيل إلى المتابعة والتطور',
          steps: [
            {
              title: 'حجز تجربة',
              description: 'ولي الأمر يحجز تجربة مناسبة حسب البرنامج والفرع.',
            },
            {
              title: 'تقييم أولي',
              description: 'المدرب يحدد مستوى اللاعب ونقاط التطوير.',
            },
            {
              title: 'خطة تدريب',
              description: 'يتم تسجيل اللاعب في برنامج مناسب وجدول واضح.',
            },
            {
              title: 'تقارير متابعة',
              description: 'ولي الأمر يتابع الحضور والتقدم والمدفوعات بسهولة.',
            },
          ],
        },
        branchesHeader: {
          eyebrow: 'الفروع',
          title: 'تدريبات قريبة منك في أكثر من موقع',
          description:
            'فروع منظمة ومجهزة لاستقبال اللاعبين حسب البرنامج والمواعيد المتاحة.',
        },
        branches: [
          {
            city: 'دبي',
            location: 'ملاعب تدريب حديثة بالقرب من المناطق السكنية الرئيسية.',
            schedule: 'الأحد - الخميس | 4 مساءً - 9 مساءً',
          },
          {
            city: 'أبوظبي',
            location: 'مرافق تدريب آمنة ومناسبة للناشئين والعائلات.',
            schedule: 'السبت - الأربعاء | 5 مساءً - 10 مساءً',
          },
          {
            city: 'الشارقة',
            location: 'فرع عائلي مميز لبرامج الأطفال والمبتدئين.',
            schedule: 'الجمعة - الثلاثاء | 4 مساءً - 8 مساءً',
          },
        ],
        portals: {
          eyebrow: 'تجربة رقمية متكاملة',
          title: 'بوابات مخصصة لكل مستخدم داخل النظام',
          parent: {
            title: 'بوابة ولي الأمر',
            description: 'متابعة الأبناء، الحضور، الاشتراكات، الفواتير، والرسائل.',
            items: ['متابعة الحضور', 'عرض الفواتير', 'طلبات التعويض'],
          },
          coach: {
            title: 'بوابة المدرب',
            description: 'جدول الحصص، تسجيل الحضور، ملاحظات الأداء، وتقارير اللاعبين.',
            items: ['حصص اليوم', 'تسجيل الحضور', 'ملاحظات التقدم'],
          },
          admin: {
            title: 'بوابة الإدارة',
            description: 'إدارة الطلاب، الفروع، البرامج، المدربين، المالية، والتقارير.',
            items: ['لوحة مؤشرات', 'إدارة مالية', 'تقارير تشغيلية'],
          },
        },
        contact: {
          eyebrow: 'تواصل معنا',
          title: 'جاهز تبدأ رحلة طفلك الرياضية؟',
          description:
            'تواصل معنا الآن لمعرفة البرامج المتاحة، أقرب فرع، مواعيد التدريب، أو حجز تجربة مجانية.',
          phone: '+971 50 000 0000',
          email: 'info@academy.ae',
          address: 'UAE Sports Academy, Dubai, UAE',
          whatsapp: 'تواصل واتساب',
          socialTitle: 'تابعنا على السوشيال ميديا',
        },
      };
    }

    return {
      common: {
        viewProgram: 'View program',
        trainingDays: 'Training days',
        supportHours: 'Daily support: 9 AM - 9 PM',
      },
      hero: {
        badge: 'Complete sports academy in the UAE',
        title: 'Build confident young athletes with elite coaching and smart academy operations',
        description:
          'A premium sports academy experience combining professional coaching, attendance tracking, subscriptions, payments, performance reports, and smooth parent communication in one connected system.',
        primary: 'Book a free trial',
        secondary: 'Explore programs',
        trust: 'Trusted by families and players across multiple branches',
        metricTitle: 'Smart Operations',
        metricSubtitle: 'Academy Control',
        growth: 'Monthly Growth',
        pathway: 'Player Pathway',
        pathwayText: 'Skills • Reports • Growth',
      },
      kpis: [
        { value: '1,200+', label: 'Active players' },
        { value: '35+', label: 'Professional coaches' },
        { value: '8', label: 'Training branches' },
        { value: '94%', label: 'Parent satisfaction' },
      ],
      about: {
        eyebrow: 'About us',
        title: 'A sports academy built around coaching, discipline, and smart tracking',
        description:
          'We help young players develop their sports, physical, and behavioral skills in a safe and structured environment, with continuous tracking for every player and clear communication between coaches, parents, and admins.',
        points: [
          'Training plans by age and level',
          'Attendance and progress tracking',
          'Simple parent digital experience',
          'Clear finance and operations management',
        ],
      },
      programsHeader: {
        eyebrow: 'Our programs',
        title: 'Sports programs designed for every player and age group',
        description:
          'Choose the right program for your child across football, swimming, basketball, fitness, and movement-based training.',
      },
      programs: [
        {
          title: 'Football Program',
          age: 'Ages 5–16',
          level: 'Beginner to advanced',
          description:
            'Progressive technical and tactical training covering ball control, passing, shooting, fitness, and teamwork.',
          icon: Trophy,
          image: trainingImages[0],
        },
        {
          title: 'Swimming Program',
          age: 'Ages 4–14',
          level: 'Foundation to pro',
          description:
            'Safe sessions to build water confidence, swimming techniques, breathing control, and stamina.',
          icon: Waves,
          image: trainingImages[1],
        },
        {
          title: 'Basketball Program',
          age: 'Ages 7–16',
          level: 'Beginner to competitive',
          description:
            'Developing movement skills, shooting, dribbling, defense, and team play inside the court.',
          icon: Dumbbell,
          image: trainingImages[2],
        },
      ],
      why: {
        eyebrow: 'Why choose us?',
        title: 'A clear training and management system from first session to performance growth',
        description:
          'The academy is not only about training. It delivers a full experience covering planning, tracking, reporting, communication, subscriptions, and payments.',
      },
      features: [
        {
          title: 'Smart player tracking',
          description:
            'Track attendance, level, notes, and skill development clearly for every player.',
          icon: Users,
        },
        {
          title: 'Organized schedules',
          description:
            'Manage sessions, coaches, branches, and capacity in a simple way.',
          icon: CalendarDays,
        },
        {
          title: 'Clear finance flow',
          description:
            'Subscriptions, invoices, payments, dues, and finance reports in one place.',
          icon: CreditCard,
        },
        {
          title: 'Admin performance reports',
          description:
            'Dashboards and KPIs that help management make faster, better decisions.',
          icon: BarChart3,
        },
      ],
      galleryHeader: {
        eyebrow: 'Training atmosphere',
        title: 'Placeholder images from inside the academy',
        description:
          'These are temporary images. You can manually replace their links later with real academy training photos.',
      },
      gallery: [
        {
          title: 'Team training',
          subtitle: 'Team spirit and discipline on the field',
          image: trainingImages[0],
        },
        {
          title: 'Skill development',
          subtitle: 'Training drills for every level',
          image: trainingImages[1],
        },
        {
          title: 'Professional sessions',
          subtitle: 'Specialized coaches and clear plans',
          image: trainingImages[2],
        },
        {
          title: 'Safe environment',
          subtitle: 'Continuous tracking and a family-friendly experience',
          image: trainingImages[3],
        },
      ],
      journey: {
        eyebrow: 'Player journey',
        title: 'From registration to tracking and growth',
        steps: [
          {
            title: 'Book a trial',
            description: 'Parents book a suitable trial by program and branch.',
          },
          {
            title: 'Initial assessment',
            description: 'The coach identifies the player level and growth areas.',
          },
          {
            title: 'Training plan',
            description: 'The player joins the right program with a clear schedule.',
          },
          {
            title: 'Progress reports',
            description: 'Parents track attendance, progress, and payments easily.',
          },
        ],
      },
      branchesHeader: {
        eyebrow: 'Branches',
        title: 'Training locations close to you',
        description:
          'Organized and equipped branches ready for players across different programs and schedules.',
      },
      branches: [
        {
          city: 'Dubai',
          location: 'Modern training fields close to key residential communities.',
          schedule: 'Sunday - Thursday | 4 PM - 9 PM',
        },
        {
          city: 'Abu Dhabi',
          location: 'Safe training facilities designed for young players and families.',
          schedule: 'Saturday - Wednesday | 5 PM - 10 PM',
        },
        {
          city: 'Sharjah',
          location: 'A family-friendly branch for children and beginner programs.',
          schedule: 'Friday - Tuesday | 4 PM - 8 PM',
        },
      ],
      portals: {
        eyebrow: 'Complete digital experience',
        title: 'Dedicated portals for every user',
        parent: {
          title: 'Parent Portal',
          description: 'Track children, attendance, subscriptions, invoices, and messages.',
          items: ['Attendance tracking', 'Invoice viewing', 'Make-up requests'],
        },
        coach: {
          title: 'Coach Portal',
          description: 'Schedules, attendance, progress notes, and player reports.',
          items: ['Today sessions', 'Mark attendance', 'Progress notes'],
        },
        admin: {
          title: 'Admin Portal',
          description: 'Manage students, branches, programs, coaches, finance, and reports.',
          items: ['Dashboard KPIs', 'Finance management', 'Operational reports'],
        },
      },
      contact: {
        eyebrow: 'Contact us',
        title: 'Ready to start your child’s sports journey?',
        description:
          'Contact us now to learn about available programs, nearest branch, training schedules, or to book a free trial.',
        phone: '+971 50 000 0000',
        email: 'info@academy.ae',
        address: 'UAE Sports Academy, Dubai, UAE',
        whatsapp: 'Chat on WhatsApp',
        socialTitle: 'Follow us on social media',
      },
    };
  }, [isArabic]);

  const socials: SocialItem[] = [
    {
      label: 'TikTok',
      href: 'https://www.tiktok.com/@your-academy',
      icon: Music2,
    },
    {
      label: 'Instagram',
      href: 'https://www.instagram.com/your-academy',
      icon: Instagram,
    },
    {
      label: 'Facebook',
      href: 'https://www.facebook.com/your-academy',
      icon: Facebook,
    },
    {
      label: 'WhatsApp',
      href: 'https://wa.me/971500000000',
      icon: MessageCircle,
    },
  ];

  return (
    <main className="relative isolate overflow-hidden text-white">
      <div
        className="fixed inset-0 -z-30 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="fixed inset-0 -z-20 bg-white/25 backdrop-blur-[1px] dark:bg-brand-dark/78 dark:backdrop-blur-[4px]" />
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_18%_12%,rgba(255,212,0,0.30),transparent_28%),radial-gradient(circle_at_78%_18%,rgba(0,18,155,0.45),transparent_32%),linear-gradient(180deg,rgba(0,18,155,0.56),rgba(5,8,22,0.94))] dark:bg-[radial-gradient(circle_at_18%_12%,rgba(255,212,0,0.24),transparent_28%),radial-gradient(circle_at_78%_18%,rgba(0,18,155,0.62),transparent_32%),linear-gradient(180deg,rgba(0,18,155,0.50),rgba(5,8,22,0.96))]" />

      <section className="relative min-h-[calc(100vh-72px)] w-full overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,8,22,0.70),rgba(0,18,155,0.26),rgba(5,8,22,0.78))]" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent to-brand-dark/90" />

        <PageContainer className="relative z-10 flex min-h-[calc(100vh-72px)] flex-col justify-center py-10 lg:py-12">
          <div className="grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <ScrollReveal>
              <div className="max-w-4xl">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-brand-yellow shadow-xl ring-1 ring-white/15 backdrop-blur-2xl">
                  <Sparkles className="h-4 w-4" />
                  {content.hero.badge}
                </div>

                <h1 className="max-w-2xl text-2xl font-black leading-tight tracking-tight text-white drop-shadow-2xl sm:text-4xl lg:text-5xl xl:text-5xl">
                  {content.hero.title}
                </h1>

                <p className="mt-5 max-w-xl text-sm leading-7 text-white/82 sm:text-base">
                  {content.hero.description}
                </p>

                <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                  <Link
                    to="/book-trial"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-yellow px-7 py-4 text-sm font-black text-brand-blue shadow-2xl transition hover:-translate-y-1 hover:bg-white"
                  >
                    {content.hero.primary}
                    <ArrowRight className="h-4 w-4 rtl:rotate-180" />
                  </Link>

                  <Link
                    to="/programs"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-white/10 px-7 py-4 text-sm font-black text-white shadow-xl ring-1 ring-white/20 backdrop-blur-2xl transition hover:-translate-y-1 hover:bg-white/20"
                  >
                    {content.hero.secondary}
                    <ChevronRight className="h-4 w-4 rtl:rotate-180" />
                  </Link>
                </div>

                <div className="mt-7 flex items-start gap-3 text-sm font-bold text-white/75">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-yellow" />
                  {content.hero.trust}
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={120}>
              <div className="relative mx-auto w-full max-w-md lg:ms-auto">
                <div className="absolute -left-8 -top-8 h-40 w-40 rounded-full bg-brand-yellow/30 blur-3xl" />
                <div className="absolute -bottom-10 -right-10 h-44 w-44 rounded-full bg-white/20 blur-3xl" />

                <div className="relative rounded-[2rem] bg-white/12 p-3 shadow-2xl ring-1 ring-white/15 backdrop-blur-2xl sm:p-4">
                  <div className="rounded-[1.6rem] bg-[#071033]/92 p-4 text-white shadow-2xl ring-1 ring-white/10 backdrop-blur-2xl sm:p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-black uppercase tracking-[0.22em] text-brand-yellow">
                          {content.hero.metricSubtitle}
                        </p>
                        <h2 className="mt-2 text-2xl font-black">
                          {content.hero.metricTitle}
                        </h2>
                      </div>

                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-yellow text-brand-blue">
                        <BarChart3 className="h-6 w-6" />
                      </div>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-3">
                      <MiniStatCard icon={CalendarDays} value="24" label="Sessions" />
                      <MiniStatCard icon={CheckCircle2} value="91%" label="Attendance" />
                      <MiniStatCard icon={CreditCard} value="18" label="Pending" />
                      <MiniStatCard icon={Users} value="1.2k" label="Players" />
                    </div>

                    <div className="mt-6 rounded-3xl bg-white/8 p-5 text-white shadow-lg ring-1 ring-white/10">
                      <div className="mb-4 flex items-center justify-between">
                        <p className="text-sm font-black">{content.hero.growth}</p>
                        <p className="text-sm font-black text-brand-yellow">+18.4%</p>
                      </div>

                      <div className="flex h-28 items-end gap-2">
                        {[42, 58, 46, 72, 64, 88, 78, 96].map((height, index) => (
                          <div
                            key={index}
                            className="flex-1 rounded-t-xl bg-brand-yellow shadow-[0_0_18px_rgba(255,212,0,0.32)]"
                            style={{ height: `${height}%` }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-5 left-3 hidden rounded-3xl bg-[#071033]/92 p-4 text-white shadow-2xl ring-1 ring-white/15 backdrop-blur-2xl sm:block">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-yellow text-brand-blue">
                      <Award className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm font-black">{content.hero.pathway}</p>
                      <p className="text-xs font-bold text-white/60">
                        {content.hero.pathwayText}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>

          <ScrollReveal delay={200}>
            <div className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 rounded-sm">
              {content.kpis.map((item) => (
                <GlassCard key={item.label} className="p-5">
                  <p className="text-3xl font-black text-brand-yellow">
                    {item.value}
                  </p>
                  <p className="mt-1 text-sm font-bold text-white/72">
                    {item.label}
                  </p>
                </GlassCard>
              ))}
            </div>
          </ScrollReveal>
        </PageContainer>
      </section>

      <SectionBlock>
        <PageContainer>
          <ScrollReveal>
            <GlassPanel>
              <div className="grid items-center gap-10 lg:grid-cols-[0.95fr_1.05fr]">
                <div>
                  <SectionEyebrow>{content.about.eyebrow}</SectionEyebrow>
                  <h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-5xl">
                    {content.about.title}
                  </h2>
                  <p className="mt-5 text-base leading-8 text-white/72 sm:text-lg">
                    {content.about.description}
                  </p>

                  <div className="mt-7 grid gap-3 sm:grid-cols-2">
                    {content.about.points.map((point) => (
                      <div
                        key={point}
                        className="flex items-center gap-3 rounded-2xl bg-white/8 p-4 shadow-sm ring-1 ring-white/10 backdrop-blur-xl"
                      >
                        <CheckCircle2 className="h-5 w-5 shrink-0 text-brand-yellow" />
                        <span className="text-sm font-black text-white">{point}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {trainingImages.map((image, index) => (
                    <div
                      key={image}
                      className={`overflow-hidden rounded-[2rem] bg-white/10 shadow-2xl ring-1 ring-white/10 ${index % 2 === 1 ? 'sm:translate-y-10' : ''
                        }`}
                    >
                      <img
                        src={image}
                        alt={`Academy training ${index + 1}`}
                        className="h-64 w-full object-cover opacity-90 transition duration-700 hover:scale-105 hover:opacity-100"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </GlassPanel>
          </ScrollReveal>
        </PageContainer>
      </SectionBlock>

      <SectionHeader
        eyebrow={content.programsHeader.eyebrow}
        title={content.programsHeader.title}
        description={content.programsHeader.description}
      />

      <SectionBlock compact>
        <PageContainer>
          <div className="grid gap-6 lg:grid-cols-3">
            {content.programs.map((program, index) => (
              <ScrollReveal key={program.title} delay={index * 100}>
                <ProgramCard
                  program={program}
                  linkLabel={content.common.viewProgram}
                />
              </ScrollReveal>
            ))}
          </div>
        </PageContainer>
      </SectionBlock>

      <SectionBlock>
        <PageContainer>
          <GlassPanel className="bg-[radial-gradient(circle_at_top_left,rgba(255,212,0,0.18),transparent_30%),linear-gradient(135deg,rgba(0,18,155,0.72),rgba(5,8,22,0.82))]">
            <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
              <ScrollReveal>
                <div>
                  <SectionEyebrow>{content.why.eyebrow}</SectionEyebrow>

                  <h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-5xl">
                    {content.why.title}
                  </h2>

                  <p className="mt-5 text-base leading-8 text-white/75">
                    {content.why.description}
                  </p>
                </div>
              </ScrollReveal>

              <div className="grid gap-5 sm:grid-cols-2">
                {content.features.map((feature, index) => (
                  <ScrollReveal key={feature.title} delay={index * 90}>
                    <FeatureCard feature={feature} />
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </GlassPanel>
        </PageContainer>
      </SectionBlock>

      <SectionHeader
        eyebrow={content.galleryHeader.eyebrow}
        title={content.galleryHeader.title}
        description={content.galleryHeader.description}
      />

      <SectionBlock compact>
        <PageContainer>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {content.gallery.map((item, index) => (
              <ScrollReveal key={item.title} delay={index * 80}>
                <article className="group overflow-hidden rounded-[2rem] bg-[#071033]/78 shadow-2xl ring-1 ring-white/10 backdrop-blur-2xl transition hover:-translate-y-2">
                  <div className="relative h-72 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-full w-full object-cover opacity-85 transition duration-700 group-hover:scale-110 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/94 via-brand-dark/20 to-transparent" />
                    <div className="absolute bottom-0 p-5 text-white">
                      <h3 className="text-xl font-black">{item.title}</h3>
                      <p className="mt-1 text-sm font-semibold text-white/75">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </PageContainer>
      </SectionBlock>

      <SectionBlock>
        <PageContainer>
          <ScrollReveal>
            <GlassPanel>
              <div className="mb-8 max-w-3xl">
                <SectionEyebrow>{content.journey.eyebrow}</SectionEyebrow>
                <h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
                  {content.journey.title}
                </h2>
              </div>

              <div className="grid gap-5 md:grid-cols-4">
                {content.journey.steps.map((step, index) => (
                  <div
                    key={step.title}
                    className="relative rounded-[2rem] bg-white/8 p-5 ring-1 ring-white/10 backdrop-blur-xl"
                  >
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-yellow text-lg font-black text-brand-blue">
                      {index + 1}
                    </div>
                    <h3 className="text-lg font-black text-white">{step.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-white/65">
                      {step.description}
                    </p>
                  </div>
                ))}
              </div>
            </GlassPanel>
          </ScrollReveal>
        </PageContainer>
      </SectionBlock>

      <SectionHeader
        eyebrow={content.branchesHeader.eyebrow}
        title={content.branchesHeader.title}
        description={content.branchesHeader.description}
      />

      <SectionBlock compact>
        <PageContainer>
          <div className="grid gap-6 md:grid-cols-3">
            {content.branches.map((branch, index) => (
              <ScrollReveal key={branch.city} delay={index * 90}>
                <article className="rounded-[2rem] bg-[#071033]/78 p-6 shadow-2xl ring-1 ring-white/10 backdrop-blur-2xl transition hover:-translate-y-2">
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-yellow text-brand-blue">
                    <MapPin className="h-7 w-7" />
                  </div>

                  <h3 className="text-xl font-black text-white">{branch.city}</h3>

                  <p className="mt-3 text-sm leading-7 text-white/68">
                    {branch.location}
                  </p>

                  <div className="mt-5 rounded-2xl bg-white/8 p-4 ring-1 ring-white/10">
                    <p className="text-xs font-bold text-white/50">
                      {content.common.trainingDays}
                    </p>
                    <p className="mt-1 text-sm font-black text-white">
                      {branch.schedule}
                    </p>
                  </div>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </PageContainer>
      </SectionBlock>

      <SectionHeader
        eyebrow={content.portals.eyebrow}
        title={content.portals.title}
        description=""
      />

      <SectionBlock compact>
        <PageContainer>
          <div className="grid gap-6 lg:grid-cols-3">
            <ScrollReveal>
              <PortalCard
                icon={Users}
                title={content.portals.parent.title}
                description={content.portals.parent.description}
                items={content.portals.parent.items}
              />
            </ScrollReveal>

            <ScrollReveal delay={100}>
              <PortalCard
                icon={Medal}
                title={content.portals.coach.title}
                description={content.portals.coach.description}
                items={content.portals.coach.items}
              />
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <PortalCard
                icon={BarChart3}
                title={content.portals.admin.title}
                description={content.portals.admin.description}
                items={content.portals.admin.items}
              />
            </ScrollReveal>
          </div>
        </PageContainer>
      </SectionBlock>

      <SectionBlock className="pb-20">
        <PageContainer>
          <ScrollReveal>
            <div className="overflow-hidden rounded-[2.75rem] bg-[radial-gradient(circle_at_top_left,rgba(255,212,0,0.20),transparent_32%),linear-gradient(135deg,rgba(0,18,155,0.88),rgba(5,8,22,0.96))] p-6 text-white shadow-2xl ring-1 ring-white/12 backdrop-blur-2xl sm:p-10 lg:p-14">
              <div className="grid gap-10 lg:grid-cols-[1fr_0.9fr]">
                <div>
                  <p className="mb-4 inline-flex rounded-full bg-brand-yellow px-4 py-2 text-sm font-black text-brand-blue">
                    {content.contact.eyebrow}
                  </p>

                  <h2 className="text-3xl font-black tracking-tight sm:text-5xl">
                    {content.contact.title}
                  </h2>

                  <p className="mt-5 max-w-2xl text-base leading-8 text-white/75">
                    {content.contact.description}
                  </p>

                  <div className="mt-8 grid gap-3 sm:grid-cols-2">
                    <ContactInfo icon={MessageCircle} label={content.contact.phone} />
                    <ContactInfo icon={Globe2} label={content.contact.email} />
                    <ContactInfo icon={MapPin} label={content.contact.address} />
                    <ContactInfo icon={Clock} label={content.common.supportHours} />
                  </div>
                </div>

                <div className="rounded-[2rem] bg-white/10 p-5 shadow-xl ring-1 ring-white/10 backdrop-blur-xl sm:p-6">
                  <h3 className="text-2xl font-black">
                    {content.contact.socialTitle}
                  </h3>

                  <div className="mt-5 grid gap-3">
                    {socials.map((social) => {
                      const Icon = social.icon;

                      return (
                        <a
                          key={social.label}
                          href={social.href}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center justify-between rounded-2xl bg-white/10 p-4 ring-1 ring-white/10 transition hover:-translate-y-1 hover:bg-white/20"
                        >
                          <span className="flex items-center gap-3">
                            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-yellow text-brand-blue">
                              <Icon className="h-5 w-5" />
                            </span>
                            <span className="font-black">{social.label}</span>
                          </span>
                          <ArrowRight className="h-4 w-4 rtl:rotate-180" />
                        </a>
                      );
                    })}
                  </div>

                  <a
                    href="https://wa.me/971500000000"
                    target="_blank"
                    rel="noreferrer"
                    className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-yellow px-7 py-4 text-sm font-black text-brand-blue transition hover:-translate-y-1 hover:bg-white"
                  >
                    <MessageCircle className="h-4 w-4" />
                    {content.contact.whatsapp}
                  </a>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </PageContainer>
      </SectionBlock>
    </main>
  );
}

function PageContainer({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  );
}

function SectionBlock({
  children,
  compact = false,
  className = '',
}: {
  children: ReactNode;
  compact?: boolean;
  className?: string;
}) {
  return (
    <section className={`${compact ? 'py-8' : 'py-12 lg:py-16'} ${className}`}>
      {children}
    </section>
  );
}

function GlassPanel({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-[2.75rem] bg-[#071033]/72 p-6 shadow-2xl ring-1 ring-white/10 backdrop-blur-2xl sm:p-8 lg:p-10 ${className}`}
    >
      {children}
    </div>
  );
}

function GlassCard({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-white/10 shadow-lg ring-1 ring-white/15 backdrop-blur-2xl ${className}`}
    >
      {children}
    </div>
  );
}

function ScrollReveal({
  children,
  className = '',
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;

    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.16,
        rootMargin: '0px 0px -80px 0px',
      },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        } ${className}`}
    >
      {children}
    </div>
  );
}

function SectionEyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="text-sm font-black uppercase tracking-[0.25em] text-brand-yellow">
      {children}
    </p>
  );
}

function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <ScrollReveal>
      <section className="py-12 text-center lg:pt-20">
        <PageContainer>
          <SectionEyebrow>{eyebrow}</SectionEyebrow>

          <h2 className="mx-auto mt-3 max-w-4xl text-3xl font-black tracking-tight text-white drop-shadow-xl sm:text-5xl">
            {title}
          </h2>

          {description ? (
            <p className="mx-auto mt-4 max-w-3xl text-base leading-8 text-white/70">
              {description}
            </p>
          ) : null}
        </PageContainer>
      </section>
    </ScrollReveal>
  );
}

function MiniStatCard({
  icon: Icon,
  value,
  label,
}: {
  icon: LucideIcon;
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-3xl bg-white/8 p-4 ring-1 ring-white/10">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-yellow text-brand-blue">
        <Icon className="h-5 w-5" />
      </div>

      <p className="text-2xl font-black text-white">{value}</p>
      <p className="mt-1 text-xs font-bold text-white/58">{label}</p>
    </div>
  );
}

function ProgramCard({
  program,
  linkLabel,
}: {
  program: ProgramItem;
  linkLabel: string;
}) {
  const Icon = program.icon;

  return (
    <article className="group overflow-hidden rounded-[2rem] bg-[#071033]/78 shadow-2xl ring-1 ring-white/10 backdrop-blur-2xl transition hover:-translate-y-2">
      <div className="relative h-64 overflow-hidden">
        <img
          src={program.image}
          alt={program.title}
          className="h-full w-full object-cover opacity-88 transition duration-700 group-hover:scale-110 group-hover:opacity-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/94 via-brand-dark/20 to-transparent" />
        <div className="absolute bottom-5 left-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-yellow text-brand-blue shadow-xl rtl:left-auto rtl:right-5">
          <Icon className="h-7 w-7" />
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-black text-white">{program.title}</h3>

        <div className="mt-3 flex flex-wrap gap-2">
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white/78 ring-1 ring-white/10">
            {program.age}
          </span>
          <span className="rounded-full bg-brand-yellow/20 px-3 py-1 text-xs font-bold text-brand-yellow">
            {program.level}
          </span>
        </div>

        <p className="mt-4 text-sm leading-7 text-white/65">
          {program.description}
        </p>

        <Link
          to="/programs"
          className="mt-6 inline-flex items-center gap-2 text-sm font-black text-brand-yellow"
        >
          {linkLabel}
          <ArrowRight className="h-4 w-4 rtl:rotate-180" />
        </Link>
      </div>
    </article>
  );
}

function FeatureCard({ feature }: { feature: FeatureItem }) {
  const Icon = feature.icon;

  return (
    <article className="rounded-[2rem] bg-white/10 p-6 shadow-lg ring-1 ring-white/10 backdrop-blur-xl transition hover:-translate-y-1 hover:bg-white/15">
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-yellow text-brand-blue">
        <Icon className="h-6 w-6" />
      </div>

      <h3 className="text-lg font-black text-white">{feature.title}</h3>

      <p className="mt-3 text-sm leading-7 text-white/68">
        {feature.description}
      </p>
    </article>
  );
}

function PortalCard({
  icon: Icon,
  title,
  description,
  items,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  items: string[];
}) {
  return (
    <article className="h-full rounded-[2rem] bg-[#071033]/78 p-6 shadow-2xl ring-1 ring-white/10 backdrop-blur-2xl transition hover:-translate-y-2">
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-yellow text-brand-blue">
        <Icon className="h-7 w-7" />
      </div>

      <h3 className="text-xl font-black text-white">{title}</h3>

      <p className="mt-3 text-sm leading-7 text-white/65">{description}</p>

      <div className="mt-5 space-y-3">
        {items.map((item) => (
          <div key={item} className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-brand-yellow" />
            <span className="text-sm font-bold text-white/70">{item}</span>
          </div>
        ))}
      </div>
    </article>
  );
}

function ContactInfo({
  icon: Icon,
  label,
}: {
  icon: LucideIcon;
  label: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-white/10 p-4 ring-1 ring-white/10">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-yellow text-brand-blue">
        <Icon className="h-5 w-5" />
      </div>
      <span className="text-sm font-bold text-white/80">{label}</span>
    </div>
  );
}