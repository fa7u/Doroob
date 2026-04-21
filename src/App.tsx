import { motion } from 'motion/react';
import { 
  Users, 
  TrendingUp, 
  Linkedin, 
  CheckCircle2, 
  ArrowRight,
  Menu,
  X,
  Camera,
  LogOut,
  LogIn,
  Lock,
  WifiOff
} from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';
import { cn } from './lib/utils';
import { db, auth, signInWithGoogle, handleFirestoreError } from './lib/firebase';
import { doc, onSnapshot, setDoc, getDocFromServer } from 'firebase/firestore';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// --- Components ---

const Navbar = ({ activeEditMode, onReset, isOffline }: { activeEditMode: boolean, onReset: () => void, isOffline?: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
              <Users className="text-white w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-indigo-900 leading-none">مجتمع دروبــ</span>
              {isOffline && (
                <span className="flex items-center gap-1 text-[8px] font-bold text-red-500 uppercase mt-0.5">
                  <WifiOff className="w-2 h-2" />
                  بدون اتصال
                </span>
              )}
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#about" className="text-gray-600 hover:text-indigo-600 transition-colors font-medium">عن المجتمع</a>
            <a href="#features" className="text-gray-600 hover:text-indigo-600 transition-colors font-medium">المميزات</a>
            <a href="#team" className="text-gray-600 hover:text-indigo-600 transition-colors font-medium">الأعضاء</a>
            
            {activeEditMode && (
              <button 
                onClick={onReset}
                className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-full text-xs font-bold hover:bg-red-100 transition-colors"
                title="استعادة البيانات الأصلية من الكود"
              >
                <Lock className="w-3 h-3" />
                استعادة الكود الجديد
              </button>
            )}

            <a href="#join" className="bg-indigo-600 text-white px-6 py-2.5 rounded-full font-bold hover:bg-indigo-700 transition-all shadow-md active:scale-95">
              انضم إلينا
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-gray-600"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-white border-b border-gray-100 p-4 flex flex-col gap-4 font-medium text-center"
        >
          <a href="#about" onClick={() => setIsOpen(false)} className="py-2 text-gray-600">عن المجتمع</a>
          <a href="#features" onClick={() => setIsOpen(false)} className="py-2 text-gray-600">المميزات</a>
          <a href="#team" onClick={() => setIsOpen(false)} className="py-2 text-gray-600">الأعضاء</a>
          <a href="#join" onClick={() => setIsOpen(false)} className="bg-indigo-600 text-white py-3 rounded-xl shadow-lg">إبدأ الآن</a>
        </motion.div>
      )}
    </nav>
  );
};

const TeamMember = ({ name, bio, image, linkedin, isEditMode, onUpdate }: any) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdate('image', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex items-center gap-4 text-right group/member relative">
      <div className="relative flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full rounded-full object-cover ring-4 ring-white shadow-lg transition-all duration-300 group-hover/member:ring-indigo-100"
          referrerPolicy="no-referrer"
        />
        
        {/* LinkedIn Button */}
        {!isEditMode && linkedin && linkedin !== "#" && (
          <a 
            href={linkedin} 
            target="_blank" 
            rel="noopener noreferrer"
            className="absolute -bottom-1 -left-1 bg-white p-1.5 rounded-full shadow-md border border-slate-100 text-indigo-600 hover:text-indigo-700 hover:scale-110 transition-all z-20"
          >
            <Linkedin className="w-3 h-3" />
          </a>
        )}

        {isEditMode && (
          <>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleFileChange}
            />
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 bg-black/50 rounded-full flex flex-col items-center justify-center cursor-pointer transition-opacity border-2 border-dashed border-white/50 z-10"
            >
              <Camera className="text-white w-4 h-4 mb-0.5" />
              <span className="text-[8px] text-white font-bold text-center leading-none">تغيير</span>
            </div>
          </>
        )}
      </div>
      
      <div className="flex-1 min-w-0 space-y-0.5">
        <h4 
          contentEditable={isEditMode}
          onBlur={(e) => onUpdate('name', e.currentTarget.innerText)}
          className={cn("font-bold text-slate-800 outline-none leading-tight text-sm md:text-base", isEditMode && "ring-1 ring-indigo-200 rounded px-1")}
        >
          {name}
        </h4>
        <p 
          contentEditable={isEditMode}
          onBlur={(e) => onUpdate('bio', e.currentTarget.innerText)}
          className={cn("text-[10px] md:text-xs text-slate-500 leading-relaxed outline-none min-h-[1.2em]", isEditMode && "ring-1 ring-indigo-200 rounded px-1")}
        >
          {bio}
        </p>

        {isEditMode && (
          <div className="mt-2 space-y-1">
            <input 
              type="url" 
              value={linkedin}
              onChange={(e: any) => onUpdate('linkedin', e.target.value)}
              placeholder="رابط لينكد إن"
              className="w-full bg-slate-50 border border-slate-200 text-slate-600 px-2 py-0.5 rounded text-[8px] outline-none focus:ring-1 focus:ring-indigo-400"
              dir="ltr"
            />
          </div>
        )}
      </div>
    </div>
  );
};

// --- Main App ---

const INITIAL_DATA = {
  "hero": {
    "badge": "من نحن؟",
    "title": "مجتمع دروبــ :\n مساحة للنمو المشترك والإبداع المستمر",
    "description": "دروب هي كلمة مقتبسة من دروب التجارة سابقاً مثل درب الحرير و درب البخور وهي مبادرة لمجموعة من المستثمرين الملائكيين، يحظون بخبرة طويلة في قطاعات مختلفة، هدفهم إضافة قيمة مختلفة وتعزيز نمو الشركات الناشئة في منطقة الشرق الأوسط وشمال أفريقيا.",
    "stat": "استثمارات الأعضاء في أكثر من 65 شركة ناشئة"
  },
  "scope": {
    "diwaniyah": {
      "title": "ديوانية دروب",
      "description": "مجموعة غير رسمية تهدف إلى تبادل الخبرات ونقل المعرفة بين المستثمرين ورواد الأعمال وتمكين العلاقات بينهم وبناء الأسس والمعايير المناسبة لبيئة استثمارية ناجحة ومستدامة."
    },
    "entrepreneurs": {
      "title": "مجتمع رواد الأعمال",
      "description": "و هي مجموعة من رواد الاعمال، تضم المجموعة نخبة من القيادات تتمتع بخبرة عالية في مختلف القطاعات لتقديم قيمة مضافة لرواد الاعمال في المنطقة"
    }
  },
  "members_intro": {
    "badge": "الأعضاء",
    "title": "نخبة من القياديين في المملكة",
    "description": "تضم دروب مجموعة من الأعضاء من كبار التنفيذيين في المنظمات والشركات الرائدة في المملكة العربية السعودية، يحظون بخبرة تغطي مجموعة متنوعة من القطاعات والوظائف."
  },
  "features": {
    "badge": "لماذا نحن؟",
    "title": "لماذا دروبــ ؟",
    "items": [
      {
        "id": 1,
        "title": "نقل المعرفة والتمكين",
        "description": "نعمل على نقل الخبرات العميقة للأعضاء لتمكين رواد الأعمال والمساهمة الفعالة في ريادة الأعمال."
      },
      {
        "id": 2,
        "title": "بيئة آمنة للمستثمرين",
        "description": "نوفر بيئة حصرية تضمن الخصوصية وتشجع على تبادل الفرص الاستثمارية بصدق وشفافية."
      },
      {
        "id": 3,
        "title": "وصول استراتيجي",
        "description": "فتح آفاق وتسهيل وصول الشركات الناشئة إلى خبرات كبار التنفيذيين في كبرى الشركات."
      }
    ]
  },
  "team": {
    "badge": "فريق العمل",
    "title": "الأعضاء المالكين",
    "members": [
      {
        "id": 1,
        "name": "ماجد الكبير",
        "bio": "خبير في مجال التقنيه المعلوماتية، والاستراتيجية وإدارة المشاريع. عمل كمدير عام للمشاريع في وزارة الطاقة وفي منشآت. مستثمر جريء.",
        "image": "https://picsum.photos/seed/majed/400/400",
        "linkedin": "https://www.linkedin.com/in/majed-al-kabeer-9b34a621"
      },
      {
        "id": 2,
        "name": "عبدالملك الحوطي",
        "bio": "متمرس في إدارة المنتجات، المبيعات وتطوير الأعمال. مستشار نمو للشركات B2B. حاصل على ماستر هندسة من جامعة دالهاوسي - كندا.",
        "image": "https://picsum.photos/seed/malik/400/400",
        "linkedin": "https://www.linkedin.com/in/amalhouti"
      },
      {
        "id": 3,
        "name": "عبدالعزيز العبيّد",
        "bio": "رئيس مجلس إدارة عدة شركات استثمارية، وعضو مجلس إدارة ومؤسس لعدة شركات ناشئة.",
        "image": "https://picsum.photos/seed/aziz/400/400",
        "linkedin": "https://www.linkedin.com/in/alobaidaziz"
      },
      {
        "id": 4,
        "name": "فيصل العبدالسلام",
        "bio": "المؤسس والرئيس التنفيذي لشركة كورفيجن للاستثمار، مستثمر ملائكي بأكثر من 65 شركة ناشئة في المحفظة الاستثمارية.",
        "image": "https://picsum.photos/seed/faisal/400/400",
        "linkedin": "https://www.linkedin.com/in/faisal-alabdulsalam"
      },
      {
        "id": 5,
        "name": "عبد الله الجذلاني",
        "bio": "نائب رئيس المبيعات التجارية بتحكم التقنية. الرئيس التنفيذي شركة بلازما. عضو مجلس إدارة لعدة شركات ومستثمر ملائكي.",
        "image": "https://picsum.photos/seed/abdullah/400/400",
        "linkedin": "https://www.linkedin.com/in/al-jazlani-4a30a110a"
      },
      {
        "id": 6,
        "name": "عبدالرحمن المرشود",
        "bio": "رائد أعمال متخصص في بناء التواجد الرقمي للمؤسسين ومضيف بودكاست مهتم بمنظومة الشركات الناشئة.",
        "image": "https://picsum.photos/seed/marshoud/400/400",
        "linkedin": "https://www.linkedin.com/in/al-marshoud-a-40a23415b"
      }
    ]
  },
  "join": {
    "title": "جاهز للانضمام؟",
    "description": "ابدأ رحلة التميز والنمو المهني مع نخبة من أفضل المبدعين في المنطقة.",
    "cta": "سجل اهتمامك الآن",
    "url": "https://tally.so/r/2ExyJp"
  },
  "footer": {
    "text": "مجتمع دروب • جميع الحقوق محفوظة"
  }
};

export default function App() {
  const [data, setData] = useState<any>(INITIAL_DATA);
  const [isEditMode, setIsEditMode] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isSyncing, setIsSyncing] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isOffline, setIsOffline] = useState(false);

  const isAdmin = user?.email === 'langmix2@gmail.com';
  const showEditTools = !import.meta.env.PROD || isAdmin;
  const activeEditMode = isEditMode && isAdmin;

  // Connection Test
  useEffect(() => {
    async function testConnection() {
      try {
        await getDocFromServer(doc(db, 'settings', 'config'));
        setIsOffline(false);
      } catch (error) {
        if(error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration. The client is offline.");
          setIsOffline(true);
        }
      }
    }
    testConnection();
  }, []);

  // Sync Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  // Sync Firestore Data
  useEffect(() => {
    const configRef = doc(db, 'settings', 'config');
    
    // onSnapshot is smart: it returns immediately from cache if available, 
    // then updates if the server has newer data.
    const unsubscribe = onSnapshot(configRef, { includeMetadataChanges: true }, (docSnap) => {
      if (docSnap.exists()) {
        const firestoreData = docSnap.data();
        
        // Merge Logic: Ensure all sections from INITIAL_DATA exist in state
        if (!isEditMode) {
          setData((prev: any) => ({
            ...INITIAL_DATA,
            ...prev,
            ...firestoreData,
            // Deep merge specific sections to ensure code updates propagate
            hero: { ...INITIAL_DATA.hero, ...(firestoreData.hero || {}) },
            features: { ...INITIAL_DATA.features, ...(firestoreData.features || {}) },
            scope: { ...INITIAL_DATA.scope, ...(firestoreData.scope || {}) },
            team: { ...INITIAL_DATA.team, ...(firestoreData.team || {}) },
            members_intro: { ...INITIAL_DATA.members_intro, ...(firestoreData.members_intro || {}) },
            join: { ...INITIAL_DATA.join, ...(firestoreData.join || {}) }
          }));
        }
      } else if (!docSnap.metadata.fromCache) {
        // Only initialize if we are truly sure it doesn't exist on server
        console.log("No data found in Firestore. Initializing with INITIAL_DATA...");
        setDoc(configRef, { ...INITIAL_DATA, updatedAt: new Date().toISOString() })
          .catch(err => console.error("Initial write failed:", err));
      }
      
      // We stop the "syncing" spinner as soon as we have ANY data (from cache or server)
      if (docSnap.exists() || !docSnap.metadata.fromCache) {
        setIsSyncing(false);
      }
    });

    return () => unsubscribe();
  }, [isEditMode]);

  // Auto-Repair Data for Admin
  useEffect(() => {
    if (isAdmin && data?.join?.url !== "https://tally.so/r/2ExyJp") {
      console.log("Admin detected: Force-syncing the correct Tally URL to database...");
      const configRef = doc(db, 'settings', 'config');
      const updatedData = {
        ...data,
        join: {
          ...data.join,
          url: "https://tally.so/r/2ExyJp"
        },
        updatedAt: new Date().toISOString()
      };
      
      setDoc(configRef, updatedData)
        .then(() => console.log("Auto-Repair: Successfully updated database with Tally URL"))
        .catch(err => console.error("Auto-Repair failed:", err));
        
      setData(updatedData); // Immediate UI update
    }
  }, [isAdmin, data, data?.join?.url]);

  const toggleEditMode = async () => {
    if (isEditMode && isAdmin) {
      setIsSaving(true);
      try {
        console.log("Attempting to save to Firestore...");
        const configRef = doc(db, 'settings', 'config');
        
        await setDoc(configRef, {
          ...data,
          updatedAt: new Date().toISOString()
        });
        
        alert("✅ تم حفظ التعديلات في قاعدة البيانات بنجاح!");
        setIsEditMode(false);
      } catch (err: any) {
        console.error("Save failed:", err);
        alert(`❌ فشل الحفظ: ${err.message || 'مشكلة في الصلاحيات'}`);
      } finally {
        setIsSaving(false);
      }
    } else {
      setIsEditMode(!isEditMode);
    }
  };

  const handleUpdate = (section: string, field: string, value: string, index?: number, subfield?: string) => {
    if (!isAdmin) return;
    
    setData((prev: any) => {
      const newData = { ...prev };
      
      if (index !== undefined) {
        if (section === 'features') {
          const newItems = [...newData.features.items];
          newItems[index] = { ...newItems[index], [field]: value };
          newData.features = { ...newData.features, items: newItems };
        } else if (section === 'team') {
          const newMembers = [...newData.team.members];
          newMembers[index] = { ...newMembers[index], [field]: value };
          newData.team = { ...newData.team, members: newMembers };
        }
      } else if (subfield) {
        newData[section] = { 
          ...newData[section], 
          [field]: { ...newData[section][field], [subfield]: value } 
        };
      } else {
        newData[section] = { ...newData[section], [field]: value };
      }
      
      return newData;
    });
  };

  const handleResetData = async () => {
    if (window.confirm('هل أنت متأكد من رغبتك في استعادة جميع النصوص الأصلية من الكود؟ سيؤدي هذا لمسح أي تعديلات يدوية أجريت سابقاً.')) {
      try {
        await setDoc(doc(db, 'settings', 'config'), { ...INITIAL_DATA, updatedAt: new Date().toISOString() });
        window.location.reload();
      } catch (err) {
        console.error("Error resetting data:", err);
        alert("حدث خطأ أثناء محاولة استعادة البيانات.");
      }
    }
  };

  if (isSyncing) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 font-medium animate-pulse">جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 selection:bg-indigo-100 selection:text-indigo-900 pb-10 grid-pattern overflow-x-hidden" dir="rtl">
      <Navbar activeEditMode={activeEditMode} onReset={handleResetData} isOffline={isOffline} />

      <main className="max-w-7xl mx-auto px-4 pt-32 pb-20 relative">
        <div className="absolute top-40 -left-64 w-96 h-96 bg-indigo-200/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 -right-64 w-96 h-96 bg-purple-200/20 rounded-full blur-[100px] pointer-events-none" />

        <div className="grid grid-cols-12 gap-6 auto-rows-[minmax(180px,_auto)]">
          
          {/* Main Hero Bento */}
          <motion.section 
            id="about" 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="col-span-12 lg:col-span-8 row-span-1 md:row-span-2 bento-card p-10 md:p-14 flex flex-col justify-center relative overflow-hidden group"
          >
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-indigo-50/50 rounded-full blur-[80px] group-hover:bg-indigo-100/60 transition-all duration-700" />
            <div className="relative z-10">
              <span 
                contentEditable={activeEditMode}
                onBlur={(e) => handleUpdate('hero', 'badge', e.currentTarget.innerText)}
                className={cn("inline-block px-4 py-1.5 mb-6 text-xs font-bold uppercase text-indigo-700 bg-indigo-100/80 rounded-full outline-none backdrop-blur-sm", activeEditMode && "ring-2 ring-indigo-400")}
              >
                {data.hero.badge}
              </span>
              <h1 
                contentEditable={activeEditMode}
                onBlur={(e) => handleUpdate('hero', 'title', e.currentTarget.innerText)}
                className={cn("text-4xl md:text-6xl font-extrabold text-slate-900 mb-8 leading-[1.1] outline-none text-right whitespace-pre-line", activeEditMode && "ring-2 ring-indigo-400 p-2 bg-indigo-50/30 rounded-xl")}
              >
                {data.hero.title}
              </h1>
              <p 
                contentEditable={activeEditMode}
                onBlur={(e) => handleUpdate('hero', 'description', e.currentTarget.innerText)}
                className={cn("max-w-2xl text-lg md:text-xl text-slate-500 leading-relaxed italic outline-none text-right", activeEditMode && "ring-2 ring-indigo-400 p-2 bg-indigo-50/30 rounded-xl")}
              >
                "{data.hero.description}"
              </p>
            </div>
          </motion.section>

          {/* Why Us Bento */}
          <motion.section 
            id="features"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
            className="col-span-12 lg:col-span-4 row-span-1 md:row-span-2 bento-card cta-gradient p-10 text-white flex flex-col justify-between shadow-2xl shadow-indigo-200/50 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-full h-full opacity-10 dot-pattern pointer-events-none" />
            <div className="relative z-10">
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-8 backdrop-blur-md border border-white/30 shadow-lg">
                <TrendingUp className="text-white w-7 h-7" />
              </div>
              <h2 
                contentEditable={activeEditMode}
                onBlur={(e) => handleUpdate('features', 'title', e.currentTarget.innerText)}
                className="text-3xl font-bold mb-8 outline-none text-right"
              >
                {data.features.title}
              </h2>
              <div className="space-y-6">
                {data.features.items.map((item: any, idx: number) => (
                  <motion.div 
                    key={item.id} 
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + (idx * 0.1) }}
                    className="flex gap-4"
                  >
                    <div className="bg-white/10 p-1 rounded-lg h-fit border border-white/20">
                      <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
                    </div>
                    <p 
                      contentEditable={activeEditMode}
                      onBlur={(e) => handleUpdate('features', 'description', e.currentTarget.innerText, idx)}
                      className="text-indigo-50/90 text-[15px] leading-relaxed outline-none text-right font-medium"
                    >
                      {item.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="relative z-10 pt-8 border-t border-white/10 flex items-center gap-3">
              <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_15px_rgba(52,211,153,0.6)]" />
              <span 
                contentEditable={activeEditMode}
                onBlur={(e) => handleUpdate('hero', 'stat', e.currentTarget.innerText)}
                className="text-[10px] font-bold uppercase opacity-90 outline-none"
              >
                {data.hero.stat}
              </span>
            </div>
          </motion.section>

          {/* Members Intro Bento */}
          <motion.section 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="col-span-12 bento-card p-10 md:p-12 bg-white border border-slate-100 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-32 h-32 bg-indigo-50 rounded-br-full opacity-40" />
            <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
              <div className="md:w-1/3 text-right">
                <span 
                  contentEditable={activeEditMode}
                  onBlur={(e) => handleUpdate('members_intro', 'badge', e.currentTarget.innerText)}
                  className={cn("inline-block px-4 py-1.5 mb-6 text-[10px] font-bold uppercase text-indigo-600 bg-indigo-50 rounded-full outline-none", activeEditMode && "ring-2 ring-indigo-400")}
                >
                  {data.members_intro?.badge || "الأعضاء"}
                </span>
                <h2 
                  contentEditable={activeEditMode}
                  onBlur={(e) => handleUpdate('members_intro', 'title', e.currentTarget.innerText)}
                  className={cn("text-3xl font-bold text-slate-900 outline-none leading-tight", activeEditMode && "ring-2 ring-indigo-400 p-1 rounded")}
                >
                  {data.members_intro?.title || "نخبة من القياديين في المملكة"}
                </h2>
              </div>
              <div className="md:w-2/3 border-r-0 md:border-r-2 border-slate-100 pr-0 md:pr-10 text-right">
                <p 
                  contentEditable={activeEditMode}
                  onBlur={(e) => handleUpdate('members_intro', 'description', e.currentTarget.innerText)}
                  className={cn("text-slate-500 leading-relaxed text-lg md:text-xl outline-none font-medium", activeEditMode && "ring-2 ring-indigo-400 p-2 rounded")}
                >
                  {data.members_intro?.description}
                </p>
              </div>
            </div>
          </motion.section>

          {/* Doroob Scope Section */}
          <motion.section 
             initial={{ opacity: 0, y: 30 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="col-span-12 lg:col-span-6 bento-card p-8 md:p-10 bg-linear-to-bl from-slate-50 to-white flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 bg-indigo-600/10 rounded-xl flex items-center justify-center mb-6 text-indigo-600">
                <Users className="w-6 h-6" />
              </div>
              <h3 
                contentEditable={activeEditMode}
                onBlur={(e) => handleUpdate('scope', 'diwaniyah', e.currentTarget.innerText, undefined, 'title')}
                className="text-2xl font-bold mb-4 text-slate-900"
              >
                {data.scope?.diwaniyah?.title || "ديوانية دروب"}
              </h3>
              <p 
                contentEditable={activeEditMode}
                onBlur={(e) => handleUpdate('scope', 'diwaniyah', e.currentTarget.innerText, undefined, 'description')}
                className="text-slate-500 leading-relaxed font-medium"
              >
                {data.scope?.diwaniyah?.description}
              </p>
            </div>
          </motion.section>

          <motion.section 
             initial={{ opacity: 0, y: 30 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ delay: 0.1 }}
             className="col-span-12 lg:col-span-6 bento-card p-8 md:p-10 bg-white border border-indigo-50 flex flex-col justify-between shadow-lg shadow-indigo-100/20"
          >
            <div>
              <div className="w-12 h-12 bg-purple-600/10 rounded-xl flex items-center justify-center mb-6 text-purple-600">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 
                contentEditable={activeEditMode}
                onBlur={(e) => handleUpdate('scope', 'entrepreneurs', e.currentTarget.innerText, undefined, 'title')}
                className="text-2xl font-bold mb-4 text-slate-900"
              >
                {data.scope?.entrepreneurs?.title || "مجتمع رواد الأعمال"}
              </h3>
              <p 
                contentEditable={activeEditMode}
                onBlur={(e) => handleUpdate('scope', 'entrepreneurs', e.currentTarget.innerText, undefined, 'description')}
                className="text-slate-500 leading-relaxed font-medium"
              >
                {data.scope?.entrepreneurs?.description}
              </p>
            </div>
          </motion.section>

          {/* Founders Bento */}
          <motion.section 
            id="team"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="col-span-12 lg:col-span-7 row-span-1 md:row-span-2 bento-card p-10 md:p-14 flex flex-col group/team"
          >
            <div className="flex items-center justify-between mb-12 text-right">
              <div className="space-y-1">
                <h3 className="text-3xl font-bold text-slate-900">الأعضاء المالكين</h3>
                <p className="text-sm text-slate-400 font-medium">القيادة الإستراتيجية لمجتمع دروب</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl group-hover/team:bg-indigo-50 transition-colors duration-500">
                <Users className="text-slate-300 w-8 h-8 group-hover/team:text-indigo-400 transition-colors" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12 grow">
              {data.team.members.map((member: any, idx: number) => (
                <TeamMember 
                  key={member.id}
                  {...member}
                  index={idx}
                  isEditMode={activeEditMode}
                  onUpdate={(field: string, val: string) => handleUpdate('team', field, val, idx)}
                />
              ))}
            </div>
          </motion.section>

          {/* Join Section */}
          <div className="col-span-12 lg:col-span-5 row-span-1 md:row-span-2 flex flex-col">
            <motion.section 
              id="join" 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grow bg-slate-950 rounded-[32px] p-12 flex flex-col items-center justify-center text-center relative overflow-hidden group shadow-2xl shadow-indigo-900/20"
            >
              <div className="absolute inset-0 bg-indigo-600/5 pointer-events-none group-hover:bg-indigo-600/10 transition-all duration-1000" />
              <div className="absolute -top-24 -left-24 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] group-hover:scale-125 transition-transform duration-1000" />
              <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px] group-hover:scale-125 transition-transform duration-1000" />
              
              <h3 
                contentEditable={activeEditMode}
                onBlur={(e) => handleUpdate('join', 'title', e.currentTarget.innerText)}
                className="text-4xl font-bold text-white mb-6 relative z-10 outline-none text-center"
              >
                {data.join.title}
              </h3>
              <p 
                contentEditable={activeEditMode}
                onBlur={(e) => handleUpdate('join', 'description', e.currentTarget.innerText)}
                className="text-slate-400 text-[15px] mb-12 max-w-xs relative z-10 leading-relaxed outline-none text-center font-medium opacity-80"
              >
                {data.join.description}
              </p>
              
              <div className="relative z-10 flex flex-col items-center gap-8 w-full max-w-sm">
                <a 
                  href={activeEditMode ? undefined : data.join.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={cn(
                    "w-full bg-indigo-600 text-white px-8 py-5 rounded-[20px] font-bold hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20 active:scale-95 flex items-center justify-center gap-3 group/btn cursor-pointer overflow-hidden relative",
                    activeEditMode && "cursor-default hover:bg-indigo-600"
                  )}
                >
                  <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
                  <span 
                    contentEditable={activeEditMode} 
                    onBlur={(e) => handleUpdate('join', 'cta', e.currentTarget.innerText)} 
                    className="outline-none relative z-10"
                  >
                    {data.join.cta}
                  </span>
                  <ArrowRight className="w-5 h-5 rotate-180 group-hover/btn:-translate-x-1.5 transition-transform relative z-10" />
                </a>
                
                {activeEditMode && (
                  <div className="w-full space-y-3 animate-in fade-in slide-in-from-top-4 duration-500 glass-panel p-4 rounded-2xl border-white/5">
                    <div className="flex justify-between items-center px-1">
                      <span className="text-[10px] text-indigo-400 font-bold uppercase">رابط التوجيه</span>
                      <span className="text-[10px] text-slate-500">سيظهر للمستخدمين عند النقر</span>
                    </div>
                    <input 
                      type="url" 
                      value={data.join.url}
                      onChange={(e: any) => handleUpdate('join', 'url', e.target.value)}
                      placeholder="https://example.com"
                      className="w-full bg-slate-900 border border-slate-800 text-indigo-200 px-4 py-3 rounded-xl text-[11px] outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 placeholder:text-slate-700 text-left transition-all"
                      dir="ltr"
                    />
                  </div>
                )}
              </div>
            </motion.section>
          </div>

        </div>
      </main>

      {showEditTools && (
        <div className="fixed bottom-6 left-6 z-[60] flex flex-col gap-3 items-start">
          {user ? (
            <div className="flex flex-col gap-2 items-start">
              <div className="bg-white/90 backdrop-blur border border-slate-200 px-4 py-2 rounded-2xl shadow-xl flex items-center gap-3">
                <img src={user.photoURL || ''} className="w-8 h-8 rounded-full border border-slate-200" alt="" referrerPolicy="no-referrer" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-800 leading-none">{user.displayName}</span>
                  <span className="text-[8px] text-slate-500 leading-none mt-1">{user.email}</span>
                </div>
                <button 
                  onClick={() => signOut(auth)}
                  className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-red-500 transition-colors"
                  title="تسجيل الخروج"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>

              {isAdmin ? (
                <>
                  {isEditMode && (
                    <button 
                      onClick={() => {
                        const dataStr = JSON.stringify(data, null, 2);
                        navigator.clipboard.writeText(dataStr);
                        alert('تم نسخ بيانات الموقع بنجاح! من فضلك قم بلصقها في الشات لإرسالها لي ليتم حفظها في الموقع للأبد قبل النشر.');
                      }}
                      className="flex items-center gap-2 px-6 py-3 rounded-full font-bold shadow-2xl bg-indigo-600 text-white transition-all active:scale-95 animate-in slide-in-from-bottom-4"
                    >
                      <CheckCircle2 className="w-5 h-5 text-white" />
                      نسخ بيانات الموقع
                    </button>
                  )}
                  <button 
                    onClick={toggleEditMode}
                    disabled={isSaving}
                    className={cn(
                      "flex items-center gap-3 px-6 py-3 rounded-full font-bold shadow-2xl transition-all active:scale-95 disabled:opacity-50",
                      isEditMode ? "bg-green-500 text-white" : "bg-slate-900 text-white"
                    )}
                  >
                    {isSaving ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        جاري الحفظ...
                      </div>
                    ) : (
                      isEditMode ? <><CheckCircle2 className="w-5 h-5 text-white" /> حفظ ومعاينة</> : <><ArrowRight className="w-5 h-5 rotate-180" /> تعديل النصوص</>
                    )}
                  </button>
                </>
              ) : (
                <div className="bg-amber-50 border border-amber-200 px-4 py-2 rounded-2xl text-amber-700 text-xs font-medium flex items-center gap-2">
                  <Lock className="w-3 h-3" />
                  أنت مسجل دخول ولكن ليس لديك صلاحية التعديل
                </div>
              )}
            </div>
          ) : (
            <button 
              onClick={() => signInWithGoogle()}
              className="flex items-center gap-3 px-6 py-3 rounded-full font-bold shadow-2xl bg-white text-slate-900 hover:bg-slate-50 transition-all active:scale-95 border border-slate-200"
            >
              <LogIn className="w-5 h-5 text-indigo-600" />
              تسجيل الدخول (للمسؤول)
            </button>
          )}
        </div>
      )}

      <footer className="py-12 bg-transparent text-center">
        <p className="text-slate-400 text-xs font-medium">
          &copy; {new Date().getFullYear()} <span contentEditable={activeEditMode} onBlur={(e) => handleUpdate('footer', 'text', e.currentTarget.innerText)} className="outline-none">{data.footer.text}</span>
        </p>
      </footer>
    </div>
  );
}
