/**
 * GramDisha AI — Client-Side Deterministic Appraisal Engine
 *
 * Implements 100% of the mathematical algorithms, statutory scheme routing (PMMY/NABARD),
 * 28-quarter amortization ledger, DSCR calculation, SWOT analysis, and AI Advisory logic.
 * Ensures zero failure when running on static hosting (Firebase Hosting, GitHub Pages, etc.)
 * or when network access to localhost:8000 is unavailable.
 */

export const BUSINESS_DATA = [
  {
    id: "dairy",
    name: "Dairy & Milk Chilling",
    name_hi: "डेयरी व दुग्ध केंद्र",
    icon: "🐄",
    description: "Milk procurement, chilling and bulk distribution",
    description_hi: "दूध संकलन, चिलिंग और क्षेत्रीय थोक वितरण",
    customer_segments: ["Households", "Tea Shops", "Hotels", "Sweet Shops"],
    customer_segments_hi: ["घरेलू ग्राहक", "चाय की दुकानें", "होटल", "मिठाई की दुकानें"],
    market_reach: { primary_km: 5, secondary_km: 15 },
    estimated_monthly_revenue: 80000,
    estimated_operating_cost: 50000,
    demand_score: 82,
    competition_score: 61,
    accessibility_score: 75,
    profit_potential_score: 80,
    risk_score: 58,
    supply_risk: "Medium",
    market_risk: "Low",
    seasonal_risk: "Medium",
    financial_risk: "Medium",
  },
  {
    id: "retail",
    name: "Kirana & General Store",
    name_hi: "किराना व जनरल स्टोर",
    icon: "🏪",
    description: "General store, grocery, daily essentials retail",
    description_hi: "जनरल स्टोर, किराना, दैनिक आवश्यक उपभोक्ता वस्तुएं",
    customer_segments: ["Households", "Local Businesses", "Institutions", "Farmers"],
    customer_segments_hi: ["घरेलू ग्राहक", "स्थानीय व्यवसाय", "संस्थान", "किसान"],
    market_reach: { primary_km: 3, secondary_km: 7 },
    estimated_monthly_revenue: 120000,
    estimated_operating_cost: 90000,
    demand_score: 88,
    competition_score: 72,
    accessibility_score: 85,
    profit_potential_score: 65,
    risk_score: 65,
    supply_risk: "Low",
    market_risk: "Medium",
    seasonal_risk: "Low",
    financial_risk: "Medium",
  },
  {
    id: "poultry",
    name: "Poultry Farm (Broiler & Layer)",
    name_hi: "मुर्गी पालन (पोल्ट्री)",
    icon: "🐔",
    description: "Poultry farming for eggs and broiler meat",
    description_hi: "अंडे और मांस उत्पादन हेतु पोल्ट्री फार्मिंग",
    customer_segments: ["Households", "Hotels", "Restaurants", "Wholesale Markets"],
    customer_segments_hi: ["घरेलू ग्राहक", "होटल", "रेस्तरां", "थोक बाज़ार"],
    market_reach: { primary_km: 5, secondary_km: 15 },
    estimated_monthly_revenue: 90000,
    estimated_operating_cost: 60000,
    demand_score: 78,
    competition_score: 45,
    accessibility_score: 65,
    profit_potential_score: 82,
    risk_score: 50,
    supply_risk: "Medium",
    market_risk: "Low",
    seasonal_risk: "High",
    financial_risk: "Medium",
  },
  {
    id: "food_processing",
    name: "Flour Mill & Spices (Atta Chakki)",
    name_hi: "आटा चक्की व मसाला पिसाई",
    icon: "🏭",
    description: "Custom grain milling, spice grinding and packaging",
    description_hi: "अनाज व मसाला पिसाई और स्थानीय पैकेजिंग सेवा",
    customer_segments: ["Households", "Retail Shops", "Wholesale Markets", "Institutions"],
    customer_segments_hi: ["घरेलू ग्राहक", "खुदरा दुकानें", "थोक बाज़ार", "संस्थान"],
    market_reach: { primary_km: 10, secondary_km: 30 },
    estimated_monthly_revenue: 110000,
    estimated_operating_cost: 72000,
    demand_score: 85,
    competition_score: 40,
    accessibility_score: 70,
    profit_potential_score: 88,
    risk_score: 52,
    supply_risk: "Medium",
    market_risk: "Low",
    seasonal_risk: "High",
    financial_risk: "Medium",
  },
  {
    id: "tailoring",
    name: "Tailoring & Garments",
    name_hi: "सिलाई व वस्त्र केंद्र",
    icon: "✂️",
    description: "Custom tailoring, uniform stitching and apparel making",
    description_hi: "कस्टम सिलाई, स्कूल ड्रेस व रेडीमेड वस्त्र निर्माण",
    customer_segments: ["Households", "Schools", "Offices", "Events/Weddings"],
    customer_segments_hi: ["घरेलू ग्राहक", "स्कूल", "कार्यालय", "आयोजन/शादियां"],
    market_reach: { primary_km: 3, secondary_km: 8 },
    estimated_monthly_revenue: 45000,
    estimated_operating_cost: 20000,
    demand_score: 75,
    competition_score: 65,
    accessibility_score: 90,
    profit_potential_score: 70,
    risk_score: 70,
    supply_risk: "Low",
    market_risk: "Medium",
    seasonal_risk: "Medium",
    financial_risk: "Low",
  },
  {
    id: "agriculture",
    name: "Tractor & Agro Machinery Hiring",
    name_hi: "ट्रैक्टर व कृषि सेवा केंद्र",
    icon: "🌾",
    description: "Custom hiring of tractors, tillers and farm equipment",
    description_hi: "खेती उपकरण किराया, जुताई व कस्टम हायरिंग केंद्र",
    customer_segments: ["Local Farmers", "Wholesale Mandis", "Agri Processors", "Panchayats"],
    customer_segments_hi: ["स्थानीय किसान", "थोक मंडियां", "कृषि प्रसंस्करणकर्ता", "पंचायतें"],
    market_reach: { primary_km: 10, secondary_km: 30 },
    estimated_monthly_revenue: 100000,
    estimated_operating_cost: 55000,
    demand_score: 90,
    competition_score: 50,
    accessibility_score: 80,
    profit_potential_score: 72,
    risk_score: 45,
    supply_risk: "High",
    market_risk: "Medium",
    seasonal_risk: "High",
    financial_risk: "Medium",
  },
  {
    id: "service_business",
    name: "Motorcycle & Auto Workshop",
    name_hi: "बाइक व ऑटो रिपेयर शॉप",
    icon: "🔧",
    description: "Two-wheeler repairs, maintenance and spares retail",
    description_hi: "टू-व्हीलर मरम्मत, स्पेयर पार्ट्स खुदरा व नियमित सर्विस",
    customer_segments: ["Households", "Local Businesses", "Farmers", "Institutions"],
    customer_segments_hi: ["घरेलू ग्राहक", "स्थानीय व्यवसाय", "किसान", "संस्थान"],
    market_reach: { primary_km: 5, secondary_km: 10 },
    estimated_monthly_revenue: 55000,
    estimated_operating_cost: 28000,
    demand_score: 80,
    competition_score: 55,
    accessibility_score: 85,
    profit_potential_score: 74,
    risk_score: 68,
    supply_risk: "Low",
    market_risk: "Medium",
    seasonal_risk: "Low",
    financial_risk: "Low",
  },
  {
    id: "handicraft",
    name: "Handicraft & Pottery",
    name_hi: "हस्तशिल्प व कुटीर उद्योग",
    icon: "🎨",
    description: "Clay terracotta, handloom craft and artisan products",
    description_hi: "मिट्टी शिल्प, हथकरघा व पारंपरिक हस्तशिल्प उत्पाद निर्माण",
    customer_segments: ["Tourists", "Retail Shops", "Online Markets", "Exporters"],
    customer_segments_hi: ["पर्यटक", "खुदरा दुकानें", "ऑनलाइन बाज़ार", "निर्यातक"],
    market_reach: { primary_km: 15, secondary_km: 50 },
    estimated_monthly_revenue: 40000,
    estimated_operating_cost: 18000,
    demand_score: 60,
    competition_score: 35,
    accessibility_score: 50,
    profit_potential_score: 70,
    risk_score: 55,
    supply_risk: "Medium",
    market_risk: "High",
    seasonal_risk: "Medium",
    financial_risk: "Low",
  },
];

export const SCHEMES = [
  {
    scheme: "PMMY Shishu Mudra Scheme",
    scheme_hi: "प्रधानमंत्री मुद्रा योजना (शिशु)",
    min_project_cost: 0,
    max_project_cost: 55555.55,
    loan_percentage: 90,
    max_loan: 50000,
    interest_rate: 8.5,
    tenure_years: 5,
    moratorium_months: 6,
  },
  {
    scheme: "PMMY Kishor Mudra Scheme",
    scheme_hi: "प्रधानमंत्री मुद्रा योजना (किशोर)",
    min_project_cost: 55555.56,
    max_project_cost: 555555.55,
    loan_percentage: 90,
    max_loan: 500000,
    interest_rate: 8.5,
    tenure_years: 7,
    moratorium_months: 6,
  },
  {
    scheme: "PMMY Tarun / NABARD Rural Enterprise",
    scheme_hi: "मुद्रा योजना (तरुण) / नाबार्ड ग्रामीण ऋण",
    min_project_cost: 555555.56,
    max_project_cost: 5000000,
    loan_percentage: 90,
    max_loan: 4500000,
    interest_rate: 8.5,
    tenure_years: 7,
    moratorium_months: 6,
  },
];

export function calculateEMI(principal, annualRate = 8.5, tenureYears = 7) {
  if (principal <= 0) return 0;
  const r = annualRate / 12 / 100;
  const n = tenureYears * 12;
  const emi = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  return Math.round(emi);
}

export function generateQuarterlySchedule(principal, annualRate = 8.5, tenureYears = 7) {
  const emi = calculateEMI(principal, annualRate, tenureYears);
  const r = annualRate / 12 / 100;
  const totalMonths = tenureYears * 12;
  let balance = principal;
  const monthly = [];

  for (let m = 1; m <= totalMonths; m++) {
    const interest = Math.round(balance * r);
    const principalPaid = m === totalMonths ? balance : Math.round(emi - interest);
    balance = Math.max(0, balance - principalPaid);
    monthly.push({
      month: m,
      emi,
      interest,
      principalPaid,
      closingBalance: balance,
    });
  }

  const quarters = [];
  for (let q = 0; q < totalMonths / 3; q++) {
    const qMonths = monthly.slice(q * 3, q * 3 + 3);
    const year = Math.floor(q / 4) + 1;
    const qInYear = (q % 4) + 1;
    quarters.push({
      quarter: `Y${year}-Q${qInYear}`,
      quarter_number: q + 1,
      principal: qMonths.reduce((s, x) => s + x.principalPaid, 0),
      interest: qMonths.reduce((s, x) => s + x.interest, 0),
      total_payment: qMonths.reduce((s, x) => s + x.emi, 0),
      remaining_balance: qMonths[qMonths.length - 1]?.closingBalance || 0,
    });
  }

  return quarters;
}

export function routeScheme(projectCost) {
  for (const s of SCHEMES) {
    if (projectCost <= s.max_project_cost) {
      const theoreticalLoan = Math.round(projectCost * (s.loan_percentage / 100));
      const loanAmount = Math.min(theoreticalLoan, s.max_loan);
      return {
        scheme: s.scheme,
        scheme_hi: s.scheme_hi,
        loan_amount: loanAmount,
        theoretical_loan: theoreticalLoan,
        interest_rate: s.interest_rate,
        tenure_years: s.tenure_years,
        moratorium_months: s.moratorium_months,
        loan_limit_applied: loanAmount < theoreticalLoan,
      };
    }
  }
  const last = SCHEMES[SCHEMES.length - 1];
  return {
    scheme: last.scheme,
    scheme_hi: last.scheme_hi,
    loan_amount: last.max_loan,
    theoretical_loan: Math.round(projectCost * 0.9),
    interest_rate: last.interest_rate,
    tenure_years: last.tenure_years,
    moratorium_months: last.moratorium_months,
    loan_limit_applied: true,
  };
}

export function runDeterministicAppraisal(input) {
  const capital = Number(input.capital) || 100000;
  const projectCost = capital * 10;
  const scheme = routeScheme(projectCost);
  const loanAmount = scheme.loan_amount;
  const emi = calculateEMI(loanAmount, scheme.interest_rate, scheme.tenure_years);
  const quarterly = generateQuarterlySchedule(loanAmount, scheme.interest_rate, scheme.tenure_years);

  const bizKey = (input.business || input.business_category || 'dairy').toLowerCase().replace(/\s+/g, '_');
  const biz = BUSINESS_DATA.find((b) => b.id === bizKey) || BUSINESS_DATA[0];

  const scaleFactor = Math.max(0.7, Math.min(3.5, capital / 100000));
  const monthlyRevenue = Math.round(biz.estimated_monthly_revenue * scaleFactor);
  const operatingCost = Math.round(biz.estimated_operating_cost * scaleFactor);
  const monthlySurplus = monthlyRevenue - operatingCost - emi;
  const surplusRatio = monthlyRevenue > 0 ? monthlySurplus / monthlyRevenue : 0;
  const dscr = emi > 0 ? Number(((monthlyRevenue - operatingCost) / emi).toFixed(2)) : 2.5;

  let healthStatus = 'comfortable';
  let healthColor = 'green';
  if (monthlySurplus < 0) {
    healthStatus = 'risky';
    healthColor = 'red';
  } else if (surplusRatio < 0.25) {
    healthStatus = 'tight';
    healthColor = 'yellow';
  }

  let financialScore = 55;
  if (surplusRatio >= 0.3) financialScore += 25;
  else if (surplusRatio >= 0.15) financialScore += 15;
  else if (surplusRatio >= 0) financialScore += 5;
  else financialScore -= 20;

  if (dscr >= 1.75) financialScore += 10;
  else if (dscr >= 1.25) financialScore += 5;

  financialScore = Math.max(0, Math.min(100, financialScore));

  const demandScore = biz.demand_score;
  const oppScore = biz.profit_potential_score;
  const compInverted = 100 - biz.competition_score;
  const riskScore = biz.risk_score;

  const rawViability =
    0.3 * demandScore +
    0.2 * financialScore +
    0.2 * oppScore +
    0.15 * compInverted +
    0.15 * riskScore;
  const viabilityScore = Math.round(Math.max(30, Math.min(96, rawViability)));

  let recState = 'RECOMMENDED';
  let recLabel = 'Recommended';
  let recLabelHi = 'अनुशंसित (व्यावहारिक)';
  if (monthlySurplus < 0 || viabilityScore < 50) {
    recState = 'NOT_RECOMMENDED';
    recLabel = 'Not Recommended';
    recLabelHi = 'उच्च वित्तीय जोखिम (अस्वीकृत)';
  } else if (viabilityScore < 80) {
    recState = 'RECOMMENDED_WITH_CONDITIONS';
    recLabel = 'Viable with Conditions';
    recLabelHi = 'शर्तों के साथ व्यावहारिक';
  }

  const analysisId = (Math.random().toString(36).substring(2, 8) + Math.random().toString(36).substring(2, 6)).toUpperCase();

  const isHi = input.language === 'hi';

  const loc = {
    state: input.state || 'Maharashtra',
    district: input.district || 'Dhule',
    block: input.block || 'Shirpur',
    village: input.village || 'Demo Village',
  };

  return {
    success: true,
    analysis_id: analysisId,
    language: input.language || 'en',
    business_name: biz.name,
    business_name_hi: biz.name_hi,
    business_icon: biz.icon,
    location: loc,
    financial: {
      margin_capital: capital,
      project_cost: projectCost,
      theoretical_loan: scheme.theoretical_loan,
      loan_amount: loanAmount,
      scheme: scheme.scheme,
      scheme_hi: scheme.scheme_hi,
      interest_rate: scheme.interest_rate,
      tenure_years: scheme.tenure_years,
      moratorium_months: scheme.moratorium_months,
      estimated_emi: emi,
      loan_limit_applied: scheme.loan_limit_applied,
      dscr: dscr,
      data_status: 'calculated',
    },
    financial_health: {
      monthly_surplus: monthlySurplus,
      surplus_ratio: Number(surplusRatio.toFixed(4)),
      status: healthStatus,
      color: healthColor,
      dscr: dscr,
      estimated_monthly_revenue: monthlyRevenue,
      operating_cost: operatingCost,
      emi: emi,
      data_status: 'calculated',
    },
    business_analysis: {
      name: biz.name,
      name_hi: biz.name_hi,
      demand_score: biz.demand_score,
      competition_score: biz.competition_score,
      risk_score: biz.risk_score,
      market_reach: biz.market_reach,
      customer_segments: biz.customer_segments,
      customer_segments_hi: biz.customer_segments_hi,
      estimated_monthly_revenue: monthlyRevenue,
      estimated_operating_cost: operatingCost,
      estimated_monthly_profit: monthlySurplus,
      data_status: 'calculated',
    },
    viability: {
      viability_score: viabilityScore,
      band: viabilityScore >= 80 ? 'Strong Opportunity' : viabilityScore >= 65 ? 'Viable with Conditions' : 'High Caution',
      band_hi: viabilityScore >= 80 ? 'मजबूत अवसर' : viabilityScore >= 65 ? 'शर्तों के साथ व्यावहारिक' : 'उच्च सावधानी',
      color: viabilityScore >= 80 ? 'green' : viabilityScore >= 65 ? 'yellow' : 'red',
      business: biz.name,
      components: {
        demand: { score: demandScore, weight: 0.3, contribution: Math.round(0.3 * demandScore) },
        financial: { score: financialScore, weight: 0.2, contribution: Math.round(0.2 * financialScore) },
        opportunity: { score: oppScore, weight: 0.2, contribution: Math.round(0.2 * oppScore) },
        competition: { raw_score: biz.competition_score, inverted: compInverted, weight: 0.15, contribution: Math.round(0.15 * compInverted) },
        risk: { raw_score: riskScore, weight: 0.15, contribution: Math.round(0.15 * riskScore) },
      },
    },
    quarterly_repayment: quarterly,
    recommendation: {
      state: recState,
      label: recLabel,
      label_hi: recLabelHi,
      viability_score: viabilityScore,
      advice: {
        do: [
          `Establish local operations for ${biz.name} in ${loc.village} catchment`,
          `Maintain ₹${Math.round(capital * 0.2).toLocaleString('en-IN')} as liquidity cash reserve`,
          `Leverage 90% loan under ${scheme.scheme} at ${scheme.interest_rate}% interest`,
        ],
        conditions: [
          `Ensure minimum DSCR of ${dscr} is maintained throughout the 7-year tenure`,
          `Strictly adhere to quarterly debt repayment of ₹${(emi * 3).toLocaleString('en-IN')}`,
        ],
      },
      actions: [
        `Register unit under MSME / Udyam portal and apply for ${scheme.scheme}`,
        `Procure standard processing machinery & raw inventory with ₹${projectCost.toLocaleString('en-IN')} outlay`,
        `Establish direct off-take agreements with local traders in ${loc.block} block`,
      ],
      actions_hi: [
        `उद्यम पोर्टल पर पंजीकरण करें और ${scheme.scheme_hi} के तहत ऋण आवेदन प्रस्तुत करें`,
        `₹${projectCost.toLocaleString('en-IN')} की कुल परियोजना लागत से मशीनरी व प्रारंभिक स्टॉक तैयार करें`,
        `${loc.block} ब्लॉक के स्थानीय थोक विक्रेताओं के साथ आपूर्ति अनुबंध स्थापित करें`,
      ],
      recommendation_en: `${recLabel} — Viability index ${viabilityScore}/100 with DSCR ${dscr}`,
      recommendation_hi: `${recLabelHi} — व्यवहार्यता सूचकांक ${viabilityScore}/100 (डीएससीआर: ${dscr})`,
      alternative_businesses: ["Retail & Grocery", "Tailoring & Garments", "Flour Mill & Spices"],
      alternatives_hi: ["किराना स्टोर", "सिलाई व वस्त्र केंद्र", "आटा चक्की व मसाला पिसाई"],
    },
    swot: {
      strengths: [
        `High localized demand in ${loc.village} & surrounding 5-15km radius`,
        `Favorable 10:90 capital structuring under ${scheme.scheme}`,
        `Comfortable DSCR of ${dscr} ensuring smooth quarterly debt servicing`,
      ],
      strengths_hi: [
        `${loc.village} और आसपास के 5-15 किमी क्षेत्र में उच्च दैनिक मांग`,
        `${scheme.scheme_hi} के तहत 10:90 की सुरक्षित पूंजी संरचना`,
        `${dscr} का मजबूत DSCR जो नियमित किस्त भुगतान सुनिश्चित करता है`,
      ],
      weaknesses: [
        `Initial working capital dependency on prompt supplier credit`,
        `Need for standard quality control and hygienic packaging standards`,
      ],
      weaknesses_hi: [
        `प्रारंभिक कार्यशील पूंजी की तरलता बनाए रखने की आवश्यकता`,
        `मानकीकृत गुणवत्ता नियंत्रण और उचित भंडारण व्यवस्था`,
      ],
      opportunities: [
        `Expanding client base to neighboring weekly Haat-bazaars in ${loc.block}`,
        `Value addition through branded packaging and bulk institutional supply`,
      ],
      opportunities_hi: [
        `${loc.block} के साप्ताहिक हाट-बाज़ारों और थोक खरीदारों तक विस्तार`,
        `ब्रांडेड पैकेजिंग और संस्थागत थोक आपूर्ति से अतिरिक्त मुनाफा`,
      ],
      threats: [
        `Seasonal price fluctuations in raw material procurement`,
        `Emergence of unorganized informal competitors in the primary radius`,
      ],
      threats_hi: [
        `कच्चे माल की कीमतों में मौसमी उतार-चढ़ाव`,
        `प्राथमिक सेवा क्षेत्र में असंगठित स्थानीय विक्रेताओं से मूल्य प्रतिस्पर्धा`,
      ],
    },
    opportunity: {
      score: oppScore,
      opportunity_score: oppScore,
      level: oppScore >= 75 ? 'High' : 'Moderate',
      opportunity_level: oppScore >= 75 ? 'High' : 'Moderate',
    },
    opportunity_insights: {
      insight: `High growth potential in ${loc.village} cluster with low organized competition and recurring consumer demand.`,
      insights_hi: `${loc.village} क्षेत्र में संगठित प्रतिस्पर्धा की कमी और नियमित मांग के कारण यह व्यवसाय अत्यधिक लाभदायक है।`,
    },
    competition: {
      level: biz.competition_score > 60 ? 'High' : 'Moderate',
      competition_level: biz.competition_score > 60 ? 'High' : 'Moderate',
      score: biz.competition_score,
    },
  };
}

export function generateLocalChatReply(message, context, language = 'en') {
  const isHi = language === 'hi';
  const lower = (message || '').toLowerCase();

  if (lower.includes('subsidy') || lower.includes('सब्सिडी') || lower.includes('छूट')) {
    return isHi
      ? `इस योजना (PMMY / नाबार्ड) के तहत ब्याज अनुदान एवं क्रेडिट गारंटी उपलब्ध है। विशेष रूप से महिला उद्यमियों एवं एसएचजी सदस्यों के लिए 15% से 25% तक की बैक-एंडेड पूंजी सब्सिडी का प्रावधान है।`
      : `Under statutory PMMY and NABARD frameworks, credit guarantee coverage is provided without collateral. Additionally, priority category applicants (SHGs/women entrepreneurs) qualify for 15%-25% back-ended capital subsidies.`;
  }

  if (lower.includes('emi') || lower.includes('किस्त') || lower.includes('loan') || lower.includes('ऋण')) {
    const emi = context?.emi || 8500;
    return isHi
      ? `आपकी अनुमानित मासिक किस्त ₹${emi.toLocaleString('en-IN')} है। इसे कम करने के लिए आप ऋण अवधि को 7 वर्ष (84 माह) तक बढ़ा सकते हैं या 6 माह के अधिस्थगन (Moratorium) का लाभ ले सकते हैं।`
      : `Your estimated monthly EMI is ₹${emi.toLocaleString('en-IN')}. You can optimize this by opting for a 7-year (84-month) tenure and availing the initial 6-month principal moratorium period.`;
  }

  if (lower.includes('risk') || lower.includes('जोखिम') || lower.includes('नुकसान')) {
    return isHi
      ? `इस व्यवसाय का मुख्य जोखिम मौसमी मूल्य उतार-चढ़ाव और कार्यशील पूंजी प्रबंधन है। न्यूनतम 3 महीने का परिचालन रिज़र्व रखने और स्थानीय थोक खरीदारों से अग्रिम अनुबंध करने से जोखिम 70% तक कम हो जाता है।`
      : `Primary risks include seasonal price volatility and working capital constraints. Maintaining a 3-month operating cash reserve and locking in advance supply contracts with local vendors mitigates over 70% of operational risk.`;
  }

  return isHi
    ? `GramDisha AI वित्तीय मॉडल के अनुसार, आपका व्यवसाय ₹${(context?.capital || 50000).toLocaleString('en-IN')} की स्वयं की पूंजी के साथ बैंक ऋण हेतु पूरी तरह व्यावहारिक है। क्या आप डीएससीआर अनुपात या 28-तिमाही किस्त तालिका के बारे में जानना चाहते हैं?`
    : `Based on the GramDisha AI financial appraisal, your enterprise with ₹${(context?.capital || 50000).toLocaleString('en-IN')} promoter margin demonstrates strong bankability with healthy debt coverage. Would you like details on DSCR sensitivity or the 28-quarter amortization ledger?`;
}

export function runMultiBusinessComparison(data) {
  const businesses = data.businesses || ['dairy', 'retail', 'tailoring', 'food_processing'];
  const capital = Number(data.capital) || 100000;

  const results = [];
  for (const bId of businesses) {
    const analysis = runDeterministicAppraisal({
      business: bId,
      capital: capital,
      state: data.state,
      district: data.district,
      block: data.block,
      village: data.village,
      language: data.language,
    });

    results.push({
      business: analysis.business_name,
      business_hi: analysis.business_name_hi,
      icon: analysis.business_icon,
      demand_score: analysis.business_analysis.demand_score,
      competition_score: analysis.business_analysis.competition_score,
      competition_level: analysis.competition.competition_level,
      opportunity_score: analysis.opportunity.opportunity_score,
      risk_score: analysis.business_analysis.risk_score,
      risk_level: analysis.business_analysis.risk_score < 55 ? 'High' : analysis.business_analysis.risk_score < 70 ? 'Moderate' : 'Low',
      financial_health: analysis.financial_health.status,
      viability_score: analysis.viability.viability_score,
      viability_band: analysis.viability.band,
      viability_band_hi: analysis.viability.band_hi,
      viability_emoji: analysis.viability.viability_score >= 80 ? '🟢' : analysis.viability.viability_score >= 65 ? '🟡' : '🟠',
    });
  }

  results.sort((a, b) => b.viability_score - a.viability_score);
  if (results.length > 0) {
    results[0].is_recommended = true;
    for (let i = 1; i < results.length; i++) {
      results[i].is_recommended = false;
    }
  }

  return {
    success: true,
    comparison: results,
    capital: capital,
  };
}
