import { Dimensions } from "react-native"
import { colors } from "./color";
import Feather from 'react-native-vector-icons/Feather'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Entypo from 'react-native-vector-icons/Entypo'
import Ionicons from 'react-native-vector-icons/Ionicons'
import AntDesign from 'react-native-vector-icons/AntDesign'

export const height = Dimensions.get('screen').height
export const width = Dimensions.get('screen').width



export const subCategories = [
  {
    id: '1',
    title: 'الكل',
    englishTitle: 'All',
    image: 'https://images.unsplash.com/photo-1522204538344-922f76eba0a4?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: '2',
    title: 'أطقم قهوة',
    englishTitle: 'coffeSets',
    image: 'https://images.unsplash.com/photo-1544787210-2211d64b5a9b?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: '3',
    title: 'ستارات',
    englishTitle: 'curtains',
    image: 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: '4',
    title: 'مكنسة كهربائية',
    englishTitle: 'vacuumCleaners',
    image: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: '5',
    title: 'ديكور المنزل',
    englishTitle: 'homeDecor',
    image: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&q=80&w=400',
  }
];

export const mainCategories = [
  {
    id: 'cat_1',
    title: 'المنزل والحديقة',
    englishTitle: 'Home ',
    image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 'cat_2',
    title: 'أدوات المطبخ',
    englishTitle: 'Kitchenware',
    image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 'cat_3',
    title: 'الأجهزة الكهربائية',
    englishTitle: 'Electronics',
    image: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 'cat_4',
    title: 'الأثاث',
    englishTitle: 'Furniture',
    image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=400',
  }
];


export const carouselData = [
  {
    id: '1',
    title: 'Modern Headphones',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop',
  },
  {
    id: '2',
    title: 'Streetwear Style',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop',
  },
  {
    id: '3',
    title: 'Wireless Audio',
    image: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?q=80&w=1000&auto=format&fit=crop',
  },
  {
    id: '5',
    title: 'Urban Fashion',
    image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1000&auto=format&fit=crop',
  }
];

export const kitchenProducts = [
  {
    id: 'k1',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSl-jiiIiAe_WilZoS97_apw7W0GPxskPNxyw&s',
    tag: 'Sale',
    tagType: 'danger',
    isNew: false,
    title: 'Granite Non-Stick',
    rating: 5,
    reviewCount: 42,
    price: 12000,
    discountPrice: 8500,
    currency: 'SYP',
    usdEquivalent: '60.00',
    isFavorite: true,
    description: "High-quality wireless headphones with active noise cancellation. Up to 30 hours of battery life with clear high-definition sound. Perfect for music and calls.",
    colors: [
      { color: '#000000', label: 'Black' },
      { color: '#808080', label: 'Gray' },
      { color: '#C0C0C0', label: 'Silver' }
    ],
    sizes: ['L', 'XL', 'XXL']
  },
  {
    id: 'k2',
    image: 'https://nestasia.in/cdn/shop/collections/Terrazzo_kitchen_roll_full_product.jpg?v=1768565707',
    tag: 'New',
    tagType: 'success',
    isNew: true,
    title: 'Professional Chef Pan',
    rating: 4,
    reviewCount: 15,


    price: 3100,
    discountPrice: 2400,
    currency: 'SYP',
    usdEquivalent: '17.00',
    isFavorite: false,
    description: "Durable chef pan designed for everyday cooking. Even heat distribution with a comfortable grip handle. Ideal for sautéing and frying.",
    colors: [
      { color: '#2C2C2C', label: 'Charcoal' },
      { color: '#A0522D', label: 'Brown' },
      { color: '#D3D3D3', label: 'Light Gray' }
    ],
    sizes: ['XS', 'S', 'XL', 'XXL']
  },
  {
    id: 'k3',
    image: 'https://m.media-amazon.com/images/I/81HpfWzaNXL._AC_UF894,1000_QL80_.jpg',
    tag: 'Trending',
    tagType: 'warning',
    isNew: false,
    title: 'Classic Dutch Oven',
    rating: 5,
    reviewCount: 89,
    price: 2500,
    discountPrice: 1850,
    currency: 'SYP',
    usdEquivalent: '13.00',
    isFavorite: true,
    description: "Heavy-duty Dutch oven perfect for slow cooking and baking. Retains heat efficiently and enhances flavor over time.",
    colors: [
      { color: '#8B0000', label: 'Dark Red' },
      { color: '#556B2F', label: 'Olive Green' },
      { color: '#000000', label: 'Black' }
    ],
    sizes: ['M', 'L', 'XL']
  },
  {
    id: 'k4',
    image: 'https://cdn.shopify.com/s/files/1/0931/2382/files/Products_A2_480x480.gif?v=1718387274',
    tag: 'Sale',
    tagType: 'danger',
    isNew: false,
    title: 'Cast Iron Skillet',
    rating: 4,
    reviewCount: 31,

    price: 4500,
    discountPrice: 3200,
    currency: 'SYP',
    usdEquivalent: '22.00',
    isFavorite: false,
    description: "Premium cast iron skillet ideal for searing, frying, and baking. Long-lasting performance with superior heat retention.",
    colors: [
      { color: '#000000', label: 'Black' },
      { color: '#3B3B3B', label: 'Dark Gray' },
      { color: '#696969', label: 'Dim Gray' }
    ],
    sizes: ['S', 'M', 'XXL']
  }
];
export const searchData = ['airPump', 'coffeSet', 'curtains', 'vacuumCleaner']
export const colorArray = [
  {
    color: 'red',
    label: "Red"
  },
  {
    color: colors.secondary,
    label: "Green"
  },
  {
    color: '#000',
    label: 'Black'
  }
]
export const sizeArray = ['S', 'M', 'L', 'XL']


export const checkoutSummary = {
  subtotal: 19175500,
  shipping: 0, // "مجاني"
  totalSYP: 19175500,
  totalUSD: 135.04,
  currency: 'SYP',
  labels: {
    discountPlaceholder: 'كود الخصم',
    applyBtn: 'تطبيق',
    subtotalLabel: 'المجموع الفرعي',
    shippingLabel: 'الشحن',
    freeLabel: 'مجاني',
    totalLabel: 'الإجمالي',
    payNowBtn: 'ادفع الآن'
  }
};

export const dashboardData = [
  {
    id: 1,
    label: 'Total Earnings',
    value: '$1,245',
    numericValue: 1245,
    icon: <Feather name={'dollar-sign'} size={20} color={colors.green1} />,
    themeColor: '#ECFDF5',
    bgColor: '#ECFDF5',
    color: colors.green1,
    borderColor: "#A4F4CF"
  },
  {
    id: 2,
    label: 'This Month',
    value: '$320',
    numericValue: 320,
    icon: <Feather name={'trending-up'} size={20} color={colors.blue} />,
    themeColor: '#EFF6FF',
    bgColor: '#EFF6FF',
    color: colors.blue,
    borderColor: "#BEDBFF"


  },
  {
    id: 3,
    label: 'Referrals',
    value: '89',
    numericValue: 89,
    icon: <Feather name={'users'} size={20} color={colors.purple} />,
    themeColor: '#FAF5FF',
    bgColor: '#F5F3FF',
    color: colors.purple,
    borderColor: "#E9D4FF"

  },
  {
    id: 4,
    label: 'Orders',
    value: '156',
    numericValue: 156,
    icon: <Feather name={'package'} size={20} color={colors.orange} />,
    themeColor: '#FFFBEB',
    bgColor: '#FFFBEB',
    color: colors.orange,
    borderColor: "#FEE685"
  }
];


export const referalData = [
  // {
  //   id: 1,
  //   name: "referalLink",
  //   icon: <Feather name={'link'} size={15} color={colors.purple} />
  // },
  {
    id: 2,
    name: "earningHistory",
    icon: <Feather name={'dollar-sign'} size={15} color={colors.purple} />
  },
  // {
  //   id: 3,
  //   name: "referalAnalytics",
  //   icon: <Feather name={'users'} size={15} color={colors.purple} />
  // }
]

export const orderButton = [
  {
    id: 1,
    name: "myOrder",
    icon: "package"
  },
  {
    id: 2,
    name: "paymentAddress",
    icon: "speaker"
  },
  {
    id: 3,
    name: "setting",
    icon: "settings"
  },
  // {
  //   id: 3,
  //   name: "favorite",
  //   icon: "heart"
  // },


]

export const socialIcons = [
  {
    id: 1,
    type: 'whatsapp', // 🌟 Added type property
    icon: <FontAwesome name={'whatsapp'} size={25} color={colors.white} />,
    color: "#00C950"
  },
  {
    id: 2,
    type: 'instagram', // 🌟 Added type property
    icon: <Entypo name={'instagram'} size={25} color={colors.white} />,
    color: "#F6339A"
  },
  {
    id: 3,
    type: 'facebook', // 🌟 Added type property
    icon: <Ionicons name={'logo-facebook'} size={28} color={colors.white} />,
    color: "#155DFC"
  },
  {
    id: 4,
    type: 'twitter', // 🌟 Added type property
    icon: <AntDesign name={'twitter'} size={25} color={colors.white} />,
    color: "#000"
  }
];


export const monthsData = [
  {
    id: 1,
    name: "all"
  },
  {
    id: 2,
    name: "thisMonth"
  },
  {
    id: 3,
    name: "lastMonth"
  },
  {
    id: 4,
    name: "custom"
  },

]


// export const commissionData = [
//   {
//     id: 1,
//     amount: '$10.00',
//     status: 'Completed',
//     date: 'January 10, 2026',
//     orderCount: 1,
//     commissionRate: '10%',
//     trendIcon: 'trending-up'
//   },
//   {
//     id: 2,
//     amount: '$99.00',
//     status: 'Completed',
//     date: 'January 13, 2026',
//     orderCount: 11,
//     commissionRate: '10%',
//     trendIcon: 'trending-up'
//   },
//   {
//     id: 3,
//     amount: '$20.00',
//     status: 'Completed',
//     date: 'January 19, 2026',
//     orderCount: 2,
//     commissionRate: '10%',
//     trendIcon: 'trending-up'
//   },
//   {
//     id: 4,
//     amount: '$33.00',
//     status: 'Completed',
//     date: 'January 25, 2026',
//     orderCount: 4,
//     commissionRate: '10%',
//     trendIcon: 'trending-up'
//   }
// ];



export const commissionData = [
  {
    id: 1,
    amount: '$10.00',
    status: 'Completed',
    date: 'April 10, 2026', // This Month
    orderCount: 1,
    commissionRate: '10%',
    trendIcon: 'trending-up'
  },
  {
    id: 2,
    amount: '$99.00',
    status: 'Completed',
    date: 'April 25, 2026', // This Month
    orderCount: 11,
    commissionRate: '10%',
    trendIcon: 'trending-up'
  },
  {
    id: 3,
    amount: '$20.00',
    status: 'Completed',
    date: 'March 15, 2026', // Last Month
    orderCount: 2,
    commissionRate: '10%',
    trendIcon: 'trending-up'
  },
  {
    id: 4,
    amount: '$33.00',
    status: 'Completed',
    date: 'March 28, 2026', // Last Month
    orderCount: 4,
    commissionRate: '10%',
    trendIcon: 'trending-up'
  }
];

export const orderFilters = [
  { id: 1, label: 'All', value: 'all', color: '#010A1A' },
  { id: 2, label: 'Delivered', value: 'delivered', color: '#00C853' },
  { id: 3, label: 'Out for Delivery', value: 'out_for_delivery', color: '#00E676' },
  { id: 4, label: 'Accepted', value: 'accepted', color: '#2979FF' },
  { id: 5, label: 'Pending', value: 'pending', color: '#FF9100' },
  { id: 6, label: 'Rejected', value: 'rejected', color: '#9CA3AF' },
  { id: 7, label: 'Cancelled', value: 'cancelled', color: '#FF1744' },
];



export const orderData = [
  {
    id: "12345",
    date: "January 12, 2026",
    status: "delivered", // Green badge
    itemsSummary: "Red Dress + Sneakers",
    totalPrice: "3,555,500",
    currency: "SYP",
    usdEquivalent: "25.00",
    productCount: 3,
    originalPrice: "4,200,000",
  },
  {
    id: "12890",
    date: "January 15, 2026",
    status: "accepted", // Blue badge
    itemsSummary: "Blue Denim Jacket + White Tee",
    totalPrice: "1,250,000",
    currency: "SYP",
    usdEquivalent: "10.50",
    productCount: 2,
    originalPrice: null,
  },
  {
    id: "13102",
    date: "February 02, 2026",
    status: "out_for_delivery", // Neon Green/Cyan badge
    itemsSummary: "Premium Wireless Headphones Pro",
    totalPrice: "5,800,000",
    currency: "SYP",
    usdEquivalent: "42.00",
    productCount: 1,
    originalPrice: "6,500,000",
  },
  {
    id: "13455",
    date: "March 10, 2026",
    status: "pending", // Orange badge
    itemsSummary: "Cotton Hoodie + Joggers",
    totalPrice: "2,100,500",
    currency: "SYP",
    usdEquivalent: "15.20",
    productCount: 2,
    originalPrice: "2,500,000",
  },
  {
    id: "14002",
    date: "April 05, 2026",
    status: "rejected", // Red badge
    itemsSummary: "Leather Belt + Silk Scarf",
    totalPrice: "850,000",
    currency: "SYP",
    usdEquivalent: "6.00",
    productCount: 2,
    originalPrice: null,
  }
];


export const addressData = [
  {
    id: 1,
    type: 'Work',
    street: 'Nile Street - Al-Sakhra Junction',
    landmark: 'In front of the supermarket',
    cityCountry: 'Syria-Aleppo',
    actions: ['Edit', 'Delete']
  },
  {
    id: 2,
    type: 'Home',
    street: 'Nile Street - Al-Sakhra Junction',
    landmark: 'In front of the supermarket',
    cityCountry: 'Syria-Aleppo',
    actions: ['Edit', 'Delete']
  }
];


export const paymentMethods = [
  {
    id: 1,
    cardHolder: 'Peter',
    cardNumber: '**** **** **** 1234',
    expiryDate: '08/28',
    brand: 'https://static.vecteezy.com/system/resources/thumbnails/020/975/570/small_2x/visa-logo-visa-icon-transparent-free-png.png',
    brandLogo: 'visa-logo-url',
    themeColor: '#1A1F71'
  },
  {
    id: 2,
    cardHolder: 'John',
    cardNumber: '**** **** **** 5678',
    expiryDate: '12/26',
    brand: 'https://download.logo.wine/logo/Mastercard/Mastercard-Logo.wine.png',
    brandLogo: 'mastercard-logo-url',
    themeColor: '#EB001B'
  },
  {
    id: 3,
    cardHolder: 'Shane Watson',
    cardNumber: '**** **** **** 9012',
    expiryDate: '05/27',
    brand: 'https://iconape.com/wp-content/png_logo_vector/%D8%B4%D8%B9%D8%A7%D8%B1-%D9%85%D8%AF%D9%89.png',
    brandLogo: 'mada-logo-url',
    themeColor: '#00B0CC'
  }
];


export const termsData = [
  {
    id: 1,
    title: '1. Introduction',
    content: 'Welcome to the Shopjy app. By using this application, you agree to comply with and be bound by the following terms and conditions. Please read them carefully before using our services.',
  },
  {
    id: 2,
    title: '2. Acceptance of Terms',
    content: 'By accessing or using the app, you agree to be bound by these Terms and Conditions and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using this application.',
  },
  {
    id: 3,
    title: '3. Permitted Use',
    content: 'You are permitted to use the app for personal and lawful commercial purposes only. Using the app for any illegal, fraudulent, or intellectual property-infringing purposes is strictly prohibited.',
  },
  {
    id: 4,
    title: '4. User Accounts',
    content: 'When creating an account, you must provide accurate and complete information. You are responsible for maintaining the confidentiality of your password and for all activities that occur under your account.',
  },
  {
    id: 5,
    title: '5. Orders and Payments',
    content: 'All orders placed through the app are subject to availability and confirmation by Shopjy. We reserve the right to refuse or cancel any order for any reason. All payments must be valid and from legitimate sources.',
  },
  {
    id: 6,
    title: '6. Pricing and Availability',
    content: 'All prices displayed on the app are subject to change without prior notice. We strive to ensure information accuracy, but errors may occur. In the event of a pricing error, we will notify you and offer the option to cancel the order.',
  },
  {
    id: 7,
    title: '7. Shipping and Delivery',
    content: 'We strive to deliver your orders on time; however, we are not responsible for delays caused by circumstances beyond our control. You will be provided with tracking information once your order has shipped.',
  },
  {
    id: 8,
    title: '8. Returns and Exchanges',
    content: 'You may return products within 14 days of receipt, provided they are in their original, unused condition. Return shipping costs are the customer\'s responsibility unless the product is defective or the wrong item was sent.',
  },
  {
    id: 9,
    title: '9. Intellectual Property Rights',
    content: 'All content on the app, including text, images, logos, and graphics, is the exclusive property of Shopjy and is protected by copyright and intellectual property laws.',
  },
  {
    id: 10,
    title: '10. Limitation of Liability',
    content: 'Shopjy shall not be liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use the app or the products.',
  },
  {
    id: 11,
    title: '11. Amendments to Terms',
    content: 'We reserve the right to modify these Terms and Conditions at any time. Any changes will be posted on this page, and you are advised to review them periodically.',
  },
  {
    id: 12,
    title: '12. Governing Law',
    content: 'These Terms and Conditions are governed by the laws of the Syrian Arab Republic. Any dispute arising from or relating to these terms shall be resolved in the competent courts of Syria.',
  },
  {
    id: 13,
    title: '13. Contact Us',
    content: 'If you have any questions regarding these Terms and Conditions, please contact us via email at: support@Shopjy.com',
  },
];


export const privacyPolicyData = [
  {
    id: 1,
    title: '1. Introduction',
    content: 'At Shopjy, we are committed to protecting your privacy and personal data. This Privacy Policy explains how we collect, use, and safeguard the information you provide to us when using our application.'
  },
  {
    id: 2,
    title: '2. Data We Collect',
    content: 'We collect the following information when you use the app:',
    bullets: [
      'Account Information: Name, email address, and phone number.',
      'Payment Information: Encrypted card details (we do not store full card data).',
      'Delivery Addresses: Full address to facilitate shipping operations.',
      'Order History: Details of purchases and favorite products.',
      'Usage Data: Information on how you interact with the app and the pages visited.',
      'Location Data: Your geographic location (with your permission) to improve delivery services.'
    ]
  },
  {
    id: 3,
    title: '3. How We Use Your Data',
    content: 'We use the collected data for the following purposes:',
    bullets: [
      'Processing and fulfilling your orders accurately and promptly.',
      'Improving user experience and personalizing content.',
      'Sending notifications regarding order status and special offers.',
      'Providing technical support and answering your inquiries.',
      'Analyzing usage patterns to develop our services.',
      'Protecting against fraud and suspicious activities.'
    ]
  },
  {
    id: 4,
    title: '4. Data Sharing with Third Parties',
    content: 'We never sell your personal data. We may share your information only with:',
    bullets: [
      'Shipping Companies: To deliver your orders.',
      'Secure Payment Processors: To complete transactions.',
      'Cloud Service Providers: To store data securely.',
      'Legal Authorities: Only when legally required.'
    ]
  },
  {
    id: 5,
    title: '5. Data Protection',
    content: 'We use the latest security technologies to protect your personal information, including:',
    bullets: [
      'SSL/TLS Encryption for all data transfers.',
      'Encryption of sensitive data within databases.',
      'Advanced firewalls and intrusion detection systems.',
      'Periodic security reviews and penetration testing.',
      'Limited access provided only to authorized personnel.'
    ]
  },
  {
    id: 6,
    title: '6. Your Data Rights',
    content: 'You have the right to:',
    bullets: [
      'Access your personal data and request a copy of it.',
      'Correct any inaccurate information.',
      'Permanently delete your account and data.',
      'Object to the processing of your data for specific purposes.',
      'Withdraw your consent for data usage at any time.'
    ]
  },
  {
    id: 7,
    title: '7. Cookies',
    content: 'We use cookies to improve your experience, including:',
    bullets: [
      'Essential Cookies: To maintain your login session.',
      'Analytical Cookies: To understand how the app is used.',
      'Advertising Cookies: To display relevant content (with your consent).'
    ],
    footer: 'You can control cookies through your browser or device settings.'
  },
  {
    id: 8,
    title: '8. Data Retention',
    content: 'We retain your data as long as your account is active or as needed to provide services. Upon account deletion, we will delete your information within 90 days, except for data we are legally required to retain.'
  },
  {
    id: 9,
    title: "9. Children's Privacy",
    content: 'Our app is not intended for children under the age of 13. We do not knowingly collect personal information from children. If we become aware that a child has provided personal information, we will delete it immediately.'
  },
  {
    id: 10,
    title: '10. Policy Updates',
    content: 'We may update this Privacy Policy from time to time. We will notify you of any material changes via email or an in-app notification.'
  },
  {
    id: 11,
    title: '11. Contact Us',
    content: 'If you have any questions or concerns regarding your privacy or this policy, please contact us:',
    bullets: [
      'Email: privacy@Shopjy.com',
      'Technical Support: support@Shopjy.com'
    ]
  }
];


export const paymentMethodsData = [
  {
    id: 1,
    title: 'shamCash',
    subTitle: 'payeasily',
    feeLabel: 'transactionFee',
    feeValue: 'free',
    iconName: 'qrcode-scan',
    iconLibrary: 'MaterialCommunityIcons', // Store as string
    iconBg: '#E7F0FF',
    iconColor: '#2563EB',
  },
  {
    id: 2,
    title: 'cashOnDel',
    subTitle: 'الدفع عند الاستلام',
    feeLabel: 'codFee',
    feeValue: '+20,000 SYP',
    iconName: 'money-bill-alt',
    iconLibrary: 'FontAwesome5', // Store as string
    iconBg: '#FFFBEB',
    iconColor: '#D97706',
  },
  {
    id: 3,
    title: 'Visa / Mastercard',
    subTitle: 'بطاقة فيزا / ماستركارد',
    feeLabel: 'transactionFee',
    feeValue: 'free',
    iconName: 'card-outline',
    iconLibrary: 'Ionicons', // Store as string
    iconBg: '#F5F3FF',
    iconColor: '#8B5CF6',
  },
  {
    id: 4,
    title: 'applePay',
    subTitle: 'fastSecure',
    feeLabel: 'transactionFee',
    feeValue: 'free',
    iconName: 'apple-pay',
    iconLibrary: 'FontAwesome5', // Store as string
    iconBg: '#F3F4F6',
    iconColor: '#000000',
  },
];


export const storiesData = [
  {
    id: 1,
    userName: 'New Story',
    mediaUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    type: 'video',
    isViewed: false,
  },
  {
    id: 2,
    userName: 'Viewed',
    mediaUrl: 'https://cdn.shopify.com/s/files/1/0931/2382/files/Products_A2_480x480.gif?v=1718387274',
    type: 'image',
    isViewed: true,
  },
];

export const namedColors = [
    'black', 'white', 'gray', 'grey', 'silver', 'maroon', 'red', 'purple', 
    'fuchsia', 'green', 'lime', 'olive', 'yellow', 'navy', 'blue', 'teal', 
    'aqua', 'orange', 'aliceblue', 'antiquewhite', 'aquamarine', 'azure', 
    'beige', 'bisque', 'blanchedalmond', 'blueviolet', 'brown', 'burlywood', 
    'cadetblue', 'chartreuse', 'chocolate', 'coral', 'cornflowerblue', 
    'cornsilk', 'crimson', 'cyan', 'darkblue', 'darkcyan', 'darkgoldenrod', 
    'darkgray', 'darkgreen', 'darkgrey', 'darkkhaki', 'darkmagenta', 
    'darkolivegreen', 'darkorange', 'darkorchid', 'darkred', 'darksalmon', 
    'darkseagreen', 'darkslateblue', 'darkslategray', 'darkslategrey', 
    'darkturquoise', 'darkviolet', 'deeppink', 'deepskyblue', 'dimgray', 
    'dimgrey', 'dodgerblue', 'firebrick', 'floralwhite', 'forestgreen', 
    'gainsboro', 'ghostwhite', 'gold', 'goldenrod', 'greenyellow', 'honeydew', 
    'hotpink', 'indianred', 'indigo', 'ivory', 'khaki', 'lavender', 
    'lavenderblush', 'lawngreen', 'lemonchiffon', 'lightblue', 'lightcoral', 
    'lightcyan', 'lightgoldenrodyellow', 'lightgray', 'lightgreen', 'lightgrey', 
    'lightpink', 'lightsalmon', 'lightseagreen', 'lightskyblue', 'lightslategray', 
    'lightslategrey', 'lightsteelblue', 'lightyellow', 'magenta', 'mediumaquamarine', 
    'mediumblue', 'mediumorchid', 'mediumpurple', 'mediumseagreen', 'mediumslateblue', 
    'mediumspringgreen', 'mediumturquoise', 'mediumvioletred', 'midnightblue', 
    'mintcream', 'mistyrose', 'moccasin', 'navajowhite', 'oldlace', 'olivedrab', 
    'orangered', 'orchid', 'palegoldenrod', 'palegreen', 'paleturquoise', 
    'palevioletred', 'papayawhip', 'peachpuff', 'peru', 'pink', 'plum', 
    'powderblue', 'rosybrown', 'royalblue', 'saddlebrown', 'salmon', 'sandybrown', 
    'seagreen', 'seashell', 'sienna', 'skyblue', 'slateGrad', 'snow', 
    'springgreen', 'steelblue', 'tan', 'thistle', 'tomato', 'turquoise', 'violet', 
    'wheat', 'whitesmoke', 'yellowgreen'
];
