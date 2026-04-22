import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, ImageBackground, ScrollView,
  SafeAreaView, Dimensions, Animated, TextInput, Pressable
} from 'react-native';

const { width } = Dimensions.get('window');
const UNIT = width / 2;
const CAROUSEL_SIZE = width * 0.8;
const BLOG_CARD_WIDTH = width * 0.75;

/* –––––––– DERGİ VERİSİ –––––––– */
const magazinePosts = [
  {
    id: 1,
    category: 'MİMARİ',
    title: 'Betonun Estetiği',
    date: '12 MAYIS',
    description:
      "Varşova'nın brütalist yapılarında saklı kalan estetik detaylar, modern mimarinin en sert ama en dürüst halini yansıtıyor. Şehrin gri blokları arasında yürürken, her bir çatlağın ve geniş pencerenin aslında birer toplumsal hafıza kaydı olduğunu fark edeceksiniz. Bu yazımızda şehrin dokusunu değiştiren anıtsal yapıları inceliyoruz.",
  },
  {
    id: 2,
    category: 'GASTRONOMİ',
    title: 'Gizli Avlular',
    date: '14 MAYIS',
    description: 'Praga bölgesinin dar sokaklarında, tabelasız kapıların ardında saklanan butik kafeler ve yerel lezzet durakları sizi bekliyor. Eski bir dökümhaneden dönüştürülen bu mekanlarda, sadece taze çekilmiş kahve kokusu değil, aynı zamanda geçmişin tozlu hikayeleri de havada asılı kalıyor. Şehrin gürültüsünden uzaklaşmak isteyenler için mükemmel bir rehber.'
  },
  {
    id: 3,
    category: 'YAŞAM',
    title: 'Gece ve Şehir',
    date: '18 MAYIS',
    description: 'Nehir kenarındaki ışıkların suya yansımasıyla başlayan gece, şehrin bambaşka bir kimliğe bürünmesini sağlıyor. Sokak sanatçılarının ezgileriyle canlanan bulvarlar, gece yarısından sonra yerini derin bir sessizliğe bırakırken; Mjasto sakinlerinin en sevdiği gece duraklarını ve sabaha karşı açık olan kütüphaneleri keşfediyoruz.'
  },
  {
    id: 4,
    category: 'KÜLTÜR',
    title: 'Analog Hafıza',
    date: '20 MAYIS',
    description:
      "Dijitalleşen dünyanın hızı içinde, 35mm filmlerin ve plakların yavaşlığında huzur bulan bir topluluk büyüyor. Karanlık odalardan çıkan taze baskıların kokusu ve iğnenin plağa değdiği o ilk saniye... Varşova'nın retro dükkanlarında zamanın nasıl durduğunu ve analog kültürün neden tekrar yükselişe geçtiğini mercek altına alıyoruz.",
  }
];

/* –––––––– MANŞET CARD –––––––– */
const HeadlineCard = ({ item }: { item: any }) => {
  const [open, setOpen] = useState(false);
  const anim = useRef(new Animated.Value(0)).current;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const toggle = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    Animated.timing(anim, { toValue: open ? 0 : 1, duration: 250, useNativeDriver: true }).start();
    setOpen(!open);
    if (!open) {
      timerRef.current = setTimeout(() => {
        Animated.timing(anim, { toValue: 0, duration: 250, useNativeDriver: true }).start();
        setOpen(false);
      }, 8000);
    }
  };

  const overlayOpacity = anim.interpolate({ inputRange: [0, 1], outputRange: [0.3, 0.8] });

  return (
    <Pressable style={styles.carouselCard} onPress={toggle}>
      <ImageBackground source={{ uri: `https://picsum.photos/seed/${item.id + 100}/800/800` }} style={styles.full}>
        <Animated.View style={[styles.headlineOverlay, { opacity: overlayOpacity }]} />
        <View style={styles.headlineTop}><Text style={styles.frontDate}>{item.date}</Text></View>
        <View style={styles.headlineBottom}>
          <Text style={styles.sourceLabel}>{item.source.toUpperCase()}</Text>
          <Text style={styles.carouselTitle}>{item.title}</Text>
          <Text style={styles.locationSmall}>{item.location}</Text>
        </View>
        <Animated.View style={[styles.headlineCenter, { opacity: anim }]}>
          <Text style={styles.headlineDesc}>{item.description}</Text>
          <Pressable style={styles.eventLink}><Text style={styles.eventLinkText}>ETKİNLİĞE GİT ➔</Text></Pressable>
        </Animated.View>
      </ImageBackground>
    </Pressable>
  );
};

/* –––––––– MOSAIC CARD –––––––– */
const MosaicCard = ({ item, w, h }: { item: any; w: number; h: number }) => {
  const [flipped, setFlipped] = useState(false);
  const flipAnim = useRef(new Animated.Value(0)).current;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const toggleFlip = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    Animated.spring(flipAnim, { toValue: flipped ? 0 : 180, friction: 8, tension: 12, useNativeDriver: true }).start();
    setFlipped(!flipped);
    if (!flipped) {
      timerRef.current = setTimeout(() => {
        Animated.spring(flipAnim, { toValue: 0, friction: 8, useNativeDriver: true }).start();
        setFlipped(false);
      }, 8000);
    }
  };

  const frontRotate = flipAnim.interpolate({ inputRange: [0, 180], outputRange: ['0deg', '180deg'] });
  const backRotate = flipAnim.interpolate({ inputRange: [0, 180], outputRange: ['180deg', '360deg'] });
  const frontOpacity = flipAnim.interpolate({ inputRange: [89, 90], outputRange: [1, 0] });
  const backOpacity = flipAnim.interpolate({ inputRange: [89, 90], outputRange: [0, 1] });

  return (
    <View style={{ width: w, height: h }}>
      <Pressable style={styles.cardContainer} onPress={toggleFlip}>
        <Animated.View style={[styles.cardSide, { transform: [{ rotateY: frontRotate }], opacity: frontOpacity }]}>
          <ImageBackground source={{ uri: `https://picsum.photos/seed/${item.id + 50}/800/1000` }} style={styles.full}>
            <View style={styles.frontOverlay}>
              <Text style={styles.frontDate}>{item.date}</Text>
              <View>
                <Text style={styles.sourceLabel}>{item.source.toUpperCase()}</Text>
                <Text style={styles.titleSerif}>{item.title}</Text>
                <Text style={styles.locationSmall}>{item.location}</Text>
              </View>
            </View>
          </ImageBackground>
        </Animated.View>
        <Animated.View style={[styles.cardSide, styles.backSide, { transform: [{ rotateY: backRotate }], opacity: backOpacity }]}>
          <View style={styles.backContent}>
            <Text style={styles.backDateText}>{item.date}</Text>
            <Text style={styles.backTitle}>{item.title}</Text>
            <Text style={styles.backDesc} numberOfLines={h < 250 ? 3 : 5}>{item.description}</Text>
            <View style={styles.addressBox}>
              <Text style={styles.backLocName}>{item.location}</Text>
              <Text style={styles.backAddress}>{item.address}</Text>
            </View>
            <View style={{ flex: 1 }} />
            <Pressable style={styles.eventLinkDark}><Text style={styles.eventLinkTextDark}>ETKİNLİĞE GİT ➔</Text></Pressable>
          </View>
        </Animated.View>
      </Pressable>
    </View>
  );
};

/* –––––––– BLOG CARD –––––––– */
const BlogCard = ({ item, index }: { item: any; index: number }) => {
  const [open, setOpen] = useState(false);
  const anim = useRef(new Animated.Value(0)).current;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const toggle = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    Animated.timing(anim, { toValue: open ? 0 : 1, duration: 350, useNativeDriver: true }).start();
    setOpen(!open);
    if (!open) {
      timerRef.current = setTimeout(() => {
        Animated.timing(anim, { toValue: 0, duration: 350, useNativeDriver: true }).start();
        setOpen(false);
      }, 10000);
    }
  };

  const overlayOpacity = anim.interpolate({ inputRange: [0, 1], outputRange: [0.3, 0.85] });
  const staticOpacity = anim.interpolate({ inputRange: [0, 0.4], outputRange: [1, 0] });
  const contentTranslateY = anim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] });

  return (
    <Pressable style={{ width: BLOG_CARD_WIDTH, height: 480, marginRight: 15 }} onPress={toggle}>
      <ImageBackground source={{ uri: `https://picsum.photos/seed/${index + 900}/800/1200` }} style={styles.full} imageStyle={{ borderRadius: 8 }}>
        <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: '#000', opacity: overlayOpacity, borderRadius: 8 }]} />
        <Animated.View style={[styles.blogOverlay, { opacity: staticOpacity }]} pointerEvents="none">
          <Text style={styles.blogTag}>{item.category}</Text>
          <Text style={styles.blogTitle}>{item.title}</Text>
        </Animated.View>
        <Animated.View style={[styles.blogExpandContent, { opacity: anim, transform: [{ translateY: contentTranslateY }] }]} pointerEvents="none">
          <View>
            <Text style={styles.blogExpandTag}>{item.category}</Text>
            <Text style={styles.blogExpandTitle}>{item.title}</Text>
            <Text style={styles.blogExpandDate}>{item.date}</Text>
          </View>
          <Text style={styles.blogExpandDesc}>{item.description}</Text>
          <View style={styles.blogReadMore}>
            <Text style={styles.blogReadMoreText}>YAZIYA GİT ➔</Text>
          </View>
        </Animated.View>
      </ImageBackground>
    </Pressable>
  );
};

/* –––––––– MJASTO SCREEN –––––––– */
type Props = {
  onAlternative: () => void;
};

export function MjastoScreen({ onAlternative }: Props) {
  const events = [
    { id: 1, title: 'Praga Jazz', date: '22.04', location: 'Vistula Bank', address: 'Warszawa', source: 'Jazz Circle', description: 'Nehir kenarında saksafon tınıları ve gün batımı eşliğinde caz deneyimi.' },
    { id: 2, title: 'Vardo Craft', date: '23.04', location: 'Studio 4', address: 'Warszawa', source: 'Leather Lab', description: 'Deri aksesuar üretimi ve el işçiliği deneyimi.' },
    { id: 3, title: 'Chess Open', date: '24.04', location: 'Targówek', address: 'Warszawa', source: 'Chess Club', description: 'Açık katılımlı satranç turnuvası.' },
    { id: 4, title: 'Silent Cinema', date: '25.04', location: 'Old Town', address: 'Warszawa', source: 'Kino Nostalgia', description: 'Sessiz film ve canlı piyano performansı.' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.nav}>
        <Text style={styles.logo}>MJASTO</Text>
      </View>

      {/* ALTERNATİF banner */}
      <View style={styles.altBanner}>
        <Pressable style={styles.altBtn} onPress={onAlternative}>
          <Text style={styles.altBtnText}>ALTERNATİF</Text>
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.searchSection}>
          <TextInput
            placeholder="Şehir arşivinde ara..."
            placeholderTextColor="#AAA"
            style={styles.searchInput}
          />
        </View>

        <Text style={styles.sectionLabel}>MANŞETLER</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={CAROUSEL_SIZE + 15}
          decelerationRate="fast"
          contentContainerStyle={styles.carouselPadding}
        >
          {events.slice(0, 3).map(ev => <HeadlineCard key={ev.id} item={ev} />)}
        </ScrollView>

        <Text style={styles.sectionLabel}>ŞEHİR MOZAİĞİ</Text>
        <View style={styles.mosaicContainer}>
          <View style={styles.row}>
            <MosaicCard item={events[0]} w={UNIT} h={400} />
            <View style={{ width: UNIT }}>
              <MosaicCard item={events[1]} w={UNIT} h={200} />
              <MosaicCard item={events[2]} w={UNIT} h={200} />
            </View>
          </View>
          <MosaicCard item={events[3]} w={width} h={200} />
        </View>

        <Text style={styles.sectionLabel}>MJASTO DERGİ</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 25, paddingBottom: 40 }}
        >
          {magazinePosts.map((post, i) => <BlogCard key={i} item={post} index={i} />)}
        </ScrollView>
        <View style={{ height: 60 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  nav: { paddingVertical: 15, alignItems: 'center', borderBottomWidth: 0.5, borderBottomColor: '#F0F0F0' },
  logo: { fontSize: 16, fontFamily: 'serif', letterSpacing: 8, fontWeight: '700' },
  altBanner: { paddingHorizontal: 25, paddingVertical: 10, alignItems: 'flex-end', borderBottomWidth: 0.5, borderBottomColor: '#F0F0F0' },
  altBtn: { paddingVertical: 5, paddingHorizontal: 10, borderWidth: 0.5, borderColor: '#BBB' },
  altBtnText: { fontSize: 8, letterSpacing: 3, color: '#999', fontWeight: '700' },
  searchSection: { padding: 25 },
  searchInput: { borderBottomWidth: 1, borderBottomColor: '#EEE', fontFamily: 'serif', fontStyle: 'italic', fontSize: 13, paddingBottom: 5 },
  sectionLabel: { fontSize: 9, letterSpacing: 3, color: '#BBB', marginLeft: 25, marginVertical: 20, fontWeight: 'bold' },
  carouselPadding: { paddingLeft: 25, paddingRight: 40 },
  carouselCard: { width: CAROUSEL_SIZE, height: 260, marginRight: 15, borderRadius: 4, overflow: 'hidden' },
  full: { width: '100%', height: '100%' },
  headlineOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: '#000' },
  headlineTop: { position: 'absolute', top: 10, right: 10 },
  headlineBottom: { position: 'absolute', bottom: 15, left: 15, right: 15 },
  headlineCenter: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center', padding: 20 },
  headlineDesc: { color: '#FFF', fontSize: 13, textAlign: 'center', marginBottom: 12, lineHeight: 18 },
  frontOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', padding: 18, justifyContent: 'space-between' },
  frontDate: { color: '#FFF', fontSize: 10, fontFamily: 'monospace', fontWeight: 'bold' },
  sourceLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 7, letterSpacing: 1 },
  carouselTitle: { color: '#FFF', fontFamily: 'serif', fontSize: 20, fontWeight: 'bold' },
  locationSmall: { color: '#EEE', fontSize: 10, fontFamily: 'serif', fontStyle: 'italic', marginTop: 2 },
  eventLink: { borderBottomWidth: 1, borderBottomColor: '#FFF' },
  eventLinkText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },
  eventLinkDark: { borderBottomWidth: 1, borderBottomColor: '#000' },
  eventLinkTextDark: { fontSize: 10, fontWeight: 'bold' },
  mosaicContainer: { backgroundColor: '#FFF' },
  row: { flexDirection: 'row' },
  cardContainer: { flex: 1 },
  cardSide: { position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden' },
  backSide: { backgroundColor: '#FFF', padding: 18 },
  titleSerif: { color: '#FFF', fontFamily: 'serif', fontSize: 17, fontWeight: '600', marginTop: 4 },
  backContent: { flex: 1 },
  backDateText: { fontSize: 10, fontWeight: 'bold', marginBottom: 6 },
  backTitle: { fontSize: 15, fontFamily: 'serif', fontWeight: 'bold', marginBottom: 6 },
  backDesc: { fontSize: 12, color: '#444' },
  addressBox: { marginTop: 10 },
  backLocName: { fontSize: 10, fontWeight: 'bold' },
  backAddress: { fontSize: 9, color: '#777' },
  blogOverlay: { flex: 1, padding: 25, justifyContent: 'flex-end' },
  blogTag: { color: '#FFF', fontSize: 8, letterSpacing: 3, fontWeight: 'bold', marginBottom: 8 },
  blogTitle: { color: '#FFF', fontFamily: 'serif', fontSize: 26, fontWeight: 'bold', lineHeight: 32 },
  blogExpandContent: { ...StyleSheet.absoluteFillObject, padding: 25, justifyContent: 'space-between' },
  blogExpandTag: { color: '#AAA', fontSize: 8, letterSpacing: 3, fontWeight: 'bold', marginBottom: 4 },
  blogExpandTitle: { color: '#FFF', fontFamily: 'serif', fontSize: 24, fontWeight: 'bold' },
  blogExpandDate: { color: '#666', fontSize: 9, fontFamily: 'monospace', marginTop: 4 },
  blogExpandDesc: { color: '#DDD', fontSize: 14, lineHeight: 22, marginTop: 10 },
  blogReadMore: { borderBottomWidth: 1, borderBottomColor: '#FFF', alignSelf: 'flex-start', marginTop: 20 },
  blogReadMoreText: { color: '#FFF', fontSize: 10, fontWeight: 'bold', paddingBottom: 4 },
});
