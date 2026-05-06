export const ROSTER_SEASONS = [
  { label: '2025 - 2026', value: '2025-26' },
  { label: '2024 - 2025', value: '2024-25' },
  { label: '2023 - 2024', value: '2023-24' },
  { label: '2022 - 2023', value: '2022-23' },
];

export const ROSTER_STATS_SEASONS = [
  { label: '2025 - 2026', value: '2025-26', start: '2025-09-01', end: '2026-08-31' },
  { label: '2023 - 2024', value: '2023-24', start: '2023-09-01', end: '2024-08-31' },
  { label: '2022 - 2023', value: '2022-23', start: '2022-09-01', end: '2023-08-31' },
];

export const ALL_TIME_STATS_SEASON = {
  label: 'All Time',
  value: 'all',
  start: '2000-09-01',
  end: '3000-09-01',
};

const BASE_URL = 'https://athletics.uwaterloo.ca';

const profileUrl = (slug, id) => `${BASE_URL}/sports/mens-badminton/roster/${slug}/${id}`;

const player = (season, name, slug, id, details = {}) => ({
  season,
  name,
  slug,
  height: '',
  eligYear: '',
  academicYear: '',
  program: '',
  hometown: '',
  highSchool: '',
  profileUrl: id ? profileUrl(slug, id) : '',
  photoUrl: '',
  aliases: [],
  ...details,
});

const staff = (season, name, title, slug, id, roleGroup = 'supportStaff', details = {}) => ({
  season,
  name,
  title,
  roleGroup,
  slug,
  profileUrl: id ? profileUrl(slug, id) : '',
  photoUrl: '',
  ...details,
});

export const ROSTERS_BY_SEASON = {
  '2025-26': {
    players: [
      player('2025-26', 'Allison Cheng', 'allison-cheng', 12514, { height: '5-2', eligYear: '2', program: 'Math/CPA', hometown: 'Toronto', highSchool: 'St. Clements', photoUrl: 'https://athletics.uwaterloo.ca/images/2026/3/4/Allison_Cheng_DxO.jpg' }),
      player('2025-26', 'Jessica Viyan Cheng', 'jessica-viyan-cheng', 12521, { height: '5-4', program: 'Architectural Engineering', hometown: 'North York', highSchool: 'St Clements School', photoUrl: 'https://athletics.uwaterloo.ca/images/2026/3/11/wloo_badminton_headshots_Jessic_Cheng_-_badminton.jpg', aliases: ['Jessica Cheng'] }),
      player('2025-26', 'Daniel Hu', 'daniel-hu', 12512, { height: '6-1', program: 'Data Science', hometown: 'Markham', highSchool: 'St.Robert Catholic High School', photoUrl: 'https://athletics.uwaterloo.ca/images/2026/3/4/Daniel_Hu_DxO.jpg' }),
      player('2025-26', 'Kelvin Huynh', 'kelvin-huynh', 12520, { height: '5-9', program: 'Mechatronics', hometown: 'Markham', highSchool: 'Unionville High School', photoUrl: 'https://athletics.uwaterloo.ca/images/2026/3/4/Kelvin_Huynh_DxO.jpg' }),
      player('2025-26', 'Ankit Mathew Jacob', 'ankit-mathew-jacob', 12527, { height: '5-11', program: 'Management Engineering', hometown: 'Kochi, India', highSchool: 'Toch Public School', photoUrl: 'https://athletics.uwaterloo.ca/images/2026/3/4/Ankit_Mathew_Jacob_DxO.jpg', aliases: ['Ankit Jacob'] }),
      player('2025-26', 'Michael Ji', 'michael-ji', 12510, { height: '5-9', program: 'Computing and Financial Management', hometown: 'Richmond Hill', highSchool: 'Richmond Hill High School', photoUrl: 'https://athletics.uwaterloo.ca/images/2026/3/4/Michael_Ji_DxO.jpg' }),
      player('2025-26', 'Jacob Kim', 'jacob-kim', 12511, { height: '5-11', program: 'Accounting & Financial Management', hometown: 'Markham', highSchool: 'Richmond Hill High School', photoUrl: 'https://athletics.uwaterloo.ca/images/2026/3/4/Jacob_Kim_DxO.jpg' }),
      player('2025-26', 'Allison Larrass', 'allison-larrass', 12517, { height: '5-4', program: 'Biological and Medical Physics', hometown: 'Guelph', highSchool: 'St. James CHS', photoUrl: 'https://athletics.uwaterloo.ca/images/2026/3/4/Allison_Larrass_DxO.jpg' }),
      player('2025-26', 'Katie Lau', 'katie-lau', 12508, { height: '5-3', program: 'Computer Science', hometown: 'Markham', highSchool: 'Markville Secondary School', photoUrl: 'https://athletics.uwaterloo.ca/images/2026/3/4/Katie_Lau_DxO.jpg' }),
      player('2025-26', 'Carolyn Lee', 'carolyn-lee', 12518, { height: '5-5', program: 'Computer Science', hometown: 'Richmond Hill', highSchool: 'Thornlea Secondary School', photoUrl: 'https://athletics.uwaterloo.ca/images/2026/3/11/wloo_badminton_headshots_Carolyn_Lee_-_badminton.jpg' }),
      player('2025-26', 'Raymond Li', 'raymond-li', 12519, { height: '5-9', program: 'Honours Mathematics', hometown: 'North York', highSchool: 'York Mills Collegiate Institute', photoUrl: 'https://athletics.uwaterloo.ca/images/2026/3/11/wloo_badminton_headshots_Raymond_Li_-_badminton.jpg' }),
      player('2025-26', 'Karla McCallum', 'karla-mccallum', 12506, { height: '5-3', program: 'Civil Engineering', hometown: 'Charlottetown', highSchool: 'Colonel Gray High School', photoUrl: 'https://athletics.uwaterloo.ca/images/2026/3/11/wloo_badminton_headshots_Karla_McCallum_-_badminton.jpg' }),
      player('2025-26', 'Taruja Pathmarajah', 'taruja-pathmarajah', 12525, { height: '5-7', program: 'Health Science', hometown: 'Scarborough', highSchool: 'Albert Campbell CI', photoUrl: 'https://athletics.uwaterloo.ca/images/2026/3/4/Taruja_Pathmarajah_DxO.jpg' }),
      player('2025-26', 'Raunak Sandhu', 'raunak-sandhu', 12522, { height: '6-1', program: 'MMath Statistics', hometown: 'Calgary', highSchool: 'Renert School', photoUrl: 'https://athletics.uwaterloo.ca/images/2026/3/4/Raunak_Sandhu_DxO.jpg' }),
      player('2025-26', 'Maggie Su', 'maggie-su', 12513, { height: '5-9', program: 'Kinesiology', hometown: 'Mississauga', highSchool: 'Lorne Park Secondary School', photoUrl: 'https://athletics.uwaterloo.ca/images/2026/3/4/Maggie_Su_DxO.jpg' }),
      player('2025-26', 'Nicole Wang', 'nicole-wang', 12507, { height: '5-4', program: 'Optometry', hometown: 'Hamilton', highSchool: 'Westdale Secondary School', photoUrl: 'https://athletics.uwaterloo.ca/images/2026/3/4/Nicole_Wang_DxO.jpg' }),
      player('2025-26', 'Ashley Wong', 'ashley-wong', 12516, { height: '5-4', program: 'Architectural Engineering', hometown: 'Markham', highSchool: 'Unionville High School', photoUrl: 'https://athletics.uwaterloo.ca/images/2026/3/4/Ashely_Wong_DxO.jpg' }),
      player('2025-26', 'Maggie Wong', 'maggie-wong', 12515, { height: '5-7', program: 'Chemical Engineering', hometown: 'Markham', highSchool: 'Bur Oak Secondary School', photoUrl: 'https://athletics.uwaterloo.ca/images/2026/3/4/Maggie_Wong_DxO.jpg', aliases: ['Maggie (Man Yan) Wong'] }),
      player('2025-26', 'Emily Xia', 'emily-xia', 12509, { height: '5-5', program: 'Computer Science Honours with Co-op', hometown: 'Richmond Hill', highSchool: 'University of Toronto Schools', photoUrl: 'https://athletics.uwaterloo.ca/images/2026/3/4/Emily_Xia_DxO.jpg' }),
      player('2025-26', 'Josh Yan', 'josh-yan', 12528, { height: '6-1', program: 'Computer Science', hometown: 'Victoria', highSchool: 'Mount Douglas Secondary School', photoUrl: 'https://athletics.uwaterloo.ca/images/2026/3/11/wloo_badminton_headshots_Joshua_Yan_-_badminton.jpg' }),
      player('2025-26', 'Jerry Yin', 'jerry-yin', 12526, { height: '5-9', program: 'Math Honors & BBA (WLU)', hometown: 'Richmond Hill', highSchool: 'Bayview SS', aliases: ['Jerry Y'] }),
      player('2025-26', 'Matthew Hanxiao Yu', 'matthew-hanxiao-yu', 12524, { height: '6-4', program: 'Computer Engineering', hometown: 'Markham', highSchool: 'Markville Secondary School', photoUrl: 'https://athletics.uwaterloo.ca/images/2026/3/4/Matthew_Yu_DxO.jpg', aliases: ['Matthew Yu'] }),
      player('2025-26', 'Liam Zhang', 'liam-zhang', 12523, { height: '5-9', program: 'Computer Engineering', hometown: 'Richmond Hill', highSchool: 'Bayview Secondary School', photoUrl: 'https://athletics.uwaterloo.ca/images/2026/3/4/Liam_Zhang_DxO.jpg' }),
    ],
    coaches: [
      staff('2025-26', 'Andrew Zhuang', 'Head Coach', 'andrew-zhuang', 1977, 'coaches'),
      staff('2025-26', 'Ivan Cheng', 'Assistant Coach', 'ivan-cheng', null, 'coaches'),
      staff('2025-26', 'Thomas Dent', 'Assistant Coach', 'thomas-dent', null, 'coaches'),
      staff('2025-26', 'Brad Enns', 'Assistant Coach', 'brad-enns', null, 'coaches'),
    ],
    supportStaff: [
      staff('2025-26', 'Teresa Trinh', 'Team Manager', 'teresa-trinh', 375),
      staff('2025-26', 'Mathura Murugesan', 'Team Manager', 'mathura-murugesan', 376),
      staff('2025-26', 'Alexis Boyd', 'Student Athletic Therapist', 'alexis-boyd', 359),
      staff('2025-26', 'Genah Nieto', 'Student Athletic Therapist', 'genah-nieto', null),
      staff('2025-26', 'Matt Anderson', 'Student Athletic Therapist', 'matt-anderson', null),
    ],
  },
  '2024-25': {
    players: [
      player('2024-25', 'Allison Cheng', 'allison-cheng', 11141, { height: '5-2', eligYear: '1', academicYear: 'First Year', program: 'Math/CPA', hometown: 'Toronto', photoUrl: 'https://athletics.uwaterloo.ca/images/2024/11/22/Badminton_Headshots_Chens_A_35bks.jpg' }),
      player('2024-25', 'Ivan Cheng', 'ivan-cheng', 11139, { height: '5-8', eligYear: '4', academicYear: 'Fourth Year', program: 'Combinatorics & Optimization', hometown: 'North York, ON', photoUrl: 'https://athletics.uwaterloo.ca/images/2024/12/3/IvanCheng-001.jpg' }),
      player('2024-25', 'Jessica Viyan Cheng', 'jessica-viyan-cheng', 11134, { height: '5-4', eligYear: '2', academicYear: 'Third Year', program: 'Architectural Engineering', hometown: 'North York', photoUrl: 'https://athletics.uwaterloo.ca/images/2024/11/22/Badminton_Headshots_Cheng_J_iKPKV.jpg', aliases: ['Jessica Cheng'] }),
      player('2024-25', 'Darren Choi', 'darren-choi', 11132, { height: '5-7', eligYear: '4', academicYear: 'Fifth Year', program: 'Systems Design Engineering', hometown: 'Richmond Hill, ON', photoUrl: 'https://athletics.uwaterloo.ca/images/2024/11/22/Badminton_Headshots_Choi_D_EL2pW.jpg' }),
      player('2024-25', 'Thomas Dent', 'thomas-dent', 11130, { height: '5-11', eligYear: '4', academicYear: 'Fourth Year', program: 'Accounting & Financial Management', hometown: 'Waterloo, ON', photoUrl: 'https://athletics.uwaterloo.ca/images/2024/11/22/Badminton_Headshots_Thomas_Dent_badminton__Ts6i9.JPG' }),
      player('2024-25', 'Daniel Hu', 'daniel-hu', 11144, { height: '6-0', eligYear: '1', academicYear: 'First Year', program: 'Mathematics', hometown: 'Markham', photoUrl: 'https://athletics.uwaterloo.ca/images/2024/11/22/Badminton_Headshots_Hu_D_rJMAG.jpg' }),
      player('2024-25', 'Kelvin Huynh', 'kelvin-huynh', 11145, { height: '5-9', eligYear: '1', academicYear: 'Fifth Year', program: 'Mechatronics Engineering', hometown: 'Markham', photoUrl: 'https://athletics.uwaterloo.ca/images/2024/11/22/Badminton_Headshots_Kelvin.Huynh_badminton__o1C8d.JPG' }),
      player('2024-25', 'Michael Ji', 'michael-ji', 11140, { height: '5-9', eligYear: '1', academicYear: 'First Year', program: 'Computing & Financial Management', hometown: 'Richmond Hill', photoUrl: 'https://athletics.uwaterloo.ca/images/2024/11/22/Badminton_Headshots_Michael_Ji_badminton__zEfiR.JPG' }),
      player('2024-25', 'Connor Johanson', 'connor-johanson', 11137, { height: '5-10', eligYear: '2', academicYear: 'Fourth Year', program: 'Mechatronics Engineering', hometown: 'Calgary, AB', photoUrl: 'https://athletics.uwaterloo.ca/images/2024/11/22/Badminton_Headshots_Johanson_C_eXaO5.jpg' }),
      player('2024-25', 'Jacob Kim', 'jacob-kim', 11138, { height: '5-11', eligYear: '4', academicYear: 'Fourth Year', program: 'Accounting & Financial Management', hometown: 'Markham', photoUrl: 'https://athletics.uwaterloo.ca/images/2024/12/3/JacobKim-001.jpg' }),
      player('2024-25', 'Siya Lai', 'siya-lai', 11129, { height: '5-4', eligYear: '4', academicYear: 'Fifth Year', program: 'Math/Business Administration', hometown: 'Aurora, ON', photoUrl: 'https://athletics.uwaterloo.ca/images/2024/12/3/Siya_Lai-001.jpg' }),
      player('2024-25', 'Andy Lang', 'andy-lang', 11135, { height: '5-9', eligYear: '2', academicYear: 'Fourth Year', program: 'Electrical Engineering', hometown: 'Markham, ON' }),
      player('2024-25', 'Allison Larrass', 'allison-larrass', 11143, { height: '5-4', eligYear: '1', academicYear: 'First Year', program: 'Biological & Medical Physics', hometown: 'Guelph', photoUrl: 'https://athletics.uwaterloo.ca/images/2024/11/22/Badminton_Headshots_Allison_Larrass_Badminton__xxTLd.JPG' }),
      player('2024-25', 'Carolyn Lee', 'carolyn-lee', 11133, { height: '5-5', eligYear: '2', academicYear: 'Third Year', program: 'Computer Science', hometown: 'Richmond Hill', photoUrl: 'https://athletics.uwaterloo.ca/images/2024/11/22/Badminton_Headshots_Lee_C_BnZ5v.jpg' }),
      player('2024-25', 'Raymond Li', 'raymond-li', 11146, { height: '5-9', eligYear: '1', academicYear: 'First Year', program: 'Mathematics', hometown: 'North York', photoUrl: 'https://athletics.uwaterloo.ca/images/2024/11/22/Badminton_Headshots_Li_R_2bDj8.jpg' }),
      player('2024-25', 'Joseph Lu', 'joseph-lu', 11126, { height: '5-10', eligYear: '5', academicYear: 'Fifth Year', program: 'Computer Science', hometown: 'Waterloo, ON', photoUrl: 'https://athletics.uwaterloo.ca/images/2024/11/22/Badminton_Headshots_Lu_J_A5MZl.jpg' }),
      player('2024-25', 'Karla McCallum', 'karla-mccallum', 11131, { height: '5-3', eligYear: '3', academicYear: 'Third Year', program: 'Civil Engineering', hometown: 'Charlottetown' }),
      player('2024-25', 'Maggie Su', 'maggie-su', 11128, { height: '4-0', eligYear: '1', academicYear: 'Second Year', program: 'Kinesiology', hometown: 'Mississauga', photoUrl: 'https://athletics.uwaterloo.ca/images/2024/11/22/Badminton_Headshots_Maggie_Su_badminton__CIANh.JPG' }),
      player('2024-25', 'Nicole Wang', 'nicole-wang', 11127, { height: '5-4', eligYear: '5', academicYear: 'Fourth Year', program: 'Optometry', hometown: 'Hamilton' }),
      player('2024-25', 'Ashley Wong', 'ashley-wong', 11142, { height: '5-4', eligYear: '4', academicYear: 'Fourth Year', program: 'Architectural Engineering', hometown: 'Markham', photoUrl: 'https://athletics.uwaterloo.ca/images/2024/12/3/AshleyWong-001.jpg' }),
      player('2024-25', 'Maggie Wong', 'maggie-wong', 11136, { height: '5-7', eligYear: '5', academicYear: 'Fourth Year', program: 'Chemical Engineering', hometown: 'Markham', photoUrl: 'https://athletics.uwaterloo.ca/images/2024/11/22/Badminton_Headshots_Wong_M_DtPMR.jpg', aliases: ['Maggie (Man Yan) Wong'] }),
      player('2024-25', 'Emily Xia', 'emily-xia', 11147, { height: '5-5', eligYear: '1', academicYear: 'First Year', program: 'Computer Science', hometown: 'Richmond Hill', photoUrl: 'https://athletics.uwaterloo.ca/images/2024/11/22/Badminton_Headshots_Emily_Xia_badminton__iljNZ.JPG' }),
    ],
    coaches: [
      staff('2024-25', 'Andrew Zhuang', 'Head Coach', 'coaches/andrew-zhuang', 1977, 'coaches'),
    ],
    supportStaff: [
      staff('2024-25', 'Teresa Trinh', 'Team Manager', 'staff/teresa-trinh', 375),
      staff('2024-25', 'Mathura Murugesan', 'Team Manager', 'staff/mathura-murugesan', 376),
      staff('2024-25', 'Nyklaas Eng', 'Student Athletic Therapist', 'staff/nyklaas-eng', 357),
      staff('2024-25', 'William Ford', 'Student Athletic Therapist', 'staff/william-ford', 358),
      staff('2024-25', 'Alexis Boyd', 'Student Athletic Therapist', 'staff/alexis-boyd', 359),
      staff('2024-25', 'Iqra Ghouri', 'Student Strength & Conditioning Coach', 'staff/iqra-ghouri', 360),
    ],
  },
  '2023-24': {
    players: [
      player('2023-24', 'Jessica Viyan Cheng', 'jessica-viyan-cheng', 10433, { eligYear: '2', academicYear: 'Second Year', program: 'Architectural Engineering', hometown: 'North York', aliases: ['Jessica Cheng'] }),
      player('2023-24', 'Darren Choi', 'darren-choi', 10434, { eligYear: '3', academicYear: 'Fourth Year', program: 'Systems Design', hometown: 'Richmond Hill, ON' }),
      player('2023-24', 'Thomas Dent', 'thomas-dent', 10435, { eligYear: '4', academicYear: 'Fourth Year', program: 'Accounting and Financial Management', hometown: 'Waterloo, ON' }),
      player('2023-24', 'Tom Guo', 'tom-guo', 10436, { eligYear: '3', academicYear: 'Third Year', program: 'Mathematical Finance', hometown: 'Calgary', aliases: ['Jun Yu Guo', 'Jun Yu (Tom) Guo'] }),
      player('2023-24', 'Connor Johanson', 'connor-johanson', 10437, { eligYear: '1', academicYear: 'Third Year', program: 'Mechatronics Engineering', hometown: 'Calgary, AB' }),
      player('2023-24', 'Jacob Kim', 'jacob-kim', 10438, { eligYear: '3', academicYear: 'Second Year', program: 'Accounting and Financial Management', hometown: 'Markham' }),
      player('2023-24', 'Siya Lai', 'siya-lai', 10439, { eligYear: '3', academicYear: 'Third Year', program: 'Math/BBA', hometown: 'Aurora, ON' }),
      player('2023-24', 'Andy Lang', 'andy-lang', 10440, { eligYear: '1', academicYear: 'Third Year', program: 'Electrical Engineering', hometown: 'Markham, ON' }),
      player('2023-24', 'Carolyn Lee', 'carolyn-lee', 10441, { eligYear: '1', academicYear: 'Second Year', program: 'Computer Science', hometown: 'Richmond Hill' }),
      player('2023-24', 'Jenny Lei', 'jenny-lei', 10442, { eligYear: '5', academicYear: 'Fifth Year', program: 'Computer Science', hometown: 'Ottawa' }),
      player('2023-24', 'Joseph Lu', 'joseph-lu', 10443, { eligYear: '4', academicYear: 'Fourth Year', program: 'Computer Science', hometown: 'Waterloo, ON' }),
      player('2023-24', 'Karla McCallum', 'karla-mccallum', 10444, { eligYear: '3', academicYear: 'Third Year', program: 'Civil Engineering', hometown: 'Charlottetown' }),
      player('2023-24', 'Maggie Su', 'maggie-su', 10445, { eligYear: '1', academicYear: 'First Year', program: 'Kinesiology', hometown: 'Mississauga' }),
      player('2023-24', 'Rachel Tang', 'rachel-tang', 10446, { eligYear: '2', academicYear: 'Fourth Year', program: 'Biomedical Sciences', hometown: 'Markham' }),
      player('2023-24', 'Kyle To', 'kyle-to', 10447, { eligYear: '4', academicYear: 'Fifth Year', program: 'Computer Engineering', hometown: 'Richmond Hill', aliases: ['Kyle Long Hung To'] }),
      player('2023-24', 'Kevin Wang', 'kevin-wang', 10448, { eligYear: '5', academicYear: 'Fifth Year', program: 'Optometry', hometown: 'Mississauga' }),
      player('2023-24', 'Nicole Wang', 'nicole-wang', 10449, { eligYear: '5', academicYear: 'Third Year', program: 'Computer Science', hometown: 'Hamilton' }),
      player('2023-24', 'Ashley Wong', 'ashley-wong', 10451, { eligYear: '3', academicYear: 'Third Year', program: 'Architectural Engineering', hometown: 'Markham' }),
      player('2023-24', 'Maggie Wong', 'maggie-wong', 10450, { eligYear: '1', academicYear: 'Fifth Year', program: 'Nanotechnology Engineering', hometown: 'Markham', aliases: ['Maggie (Man Yan) Wong'] }),
    ],
    coaches: [],
    supportStaff: [],
  },
  '2022-23': {
    players: [
      player('2022-23', 'Ivan Cheng', 'ivan-cheng', 9452, { eligYear: '3', academicYear: 'Fourth Year', program: 'Math/BBA', hometown: 'North York, ON' }),
      player('2022-23', 'Jessica Cheng', 'jessica-cheng', 9454, { eligYear: '1', academicYear: 'First Year', program: 'Architectural Engineering', hometown: 'North York', aliases: ['Jessica Viyan Cheng'] }),
      player('2022-23', 'Minh Cheng', 'minh-cheng', 9453, { eligYear: '1', academicYear: 'First Year', program: 'Computer Engineering', hometown: 'Toronto' }),
      player('2022-23', 'Arthur Cheung', 'arthur-cheung', 9455, { eligYear: '1', academicYear: 'Fourth Year', program: 'Kinesiology', hometown: 'Markham' }),
      player('2022-23', 'Darren Choi', 'darren-choi', 9456, { eligYear: '2', academicYear: 'Third Year', program: 'Systems Design Engineering', hometown: 'Richmond Hill, ON' }),
      player('2022-23', 'Thomas Dent', 'thomas-dent', 9457, { eligYear: '2', academicYear: 'Third Year', program: 'Accounting and Financial Management', hometown: 'Waterloo, ON' }),
      player('2022-23', 'Jun Yu (Tom) Guo', 'jun-yu-tom-guo', 9458, { eligYear: '2', academicYear: 'Second Year', program: 'Math', hometown: 'Calgary', aliases: ['Tom Guo', 'Jun Yu Guo'] }),
      player('2022-23', 'Jacob Kim', 'jacob-kim', 9459, { eligYear: '2', academicYear: 'Second Year', program: 'Accounting and Financial Management', hometown: 'Markham' }),
      player('2022-23', 'Siya Lai', 'siya-lai', 9460, { eligYear: '2', academicYear: 'Third Year', program: 'Mathematics Dbl Degree', hometown: 'Aurora, ON' }),
      player('2022-23', 'Jodi Lee', 'jodi-lee', 9461, { eligYear: '4', academicYear: 'Fourth Year', program: 'Financial Analysis & Risk Management', hometown: 'Richmond Hill' }),
      player('2022-23', 'Jenny Lei', 'jenny-lei', 9462, { eligYear: '3', academicYear: 'Fourth Year', program: 'Computer Science', hometown: 'Ottawa' }),
      player('2022-23', 'Augusta Li', 'augusta-li', 9463, { eligYear: '1', academicYear: 'Fourth Year', program: 'Architectural Engineering', hometown: 'Whitby' }),
      player('2022-23', 'Joseph Lu', 'joseph-lu', 9464, { eligYear: '2', academicYear: 'Third Year', program: 'Computer Science', hometown: 'Waterloo, ON' }),
      player('2022-23', 'Karla McCallum', 'karla-mccallum', 9465, { eligYear: '2', academicYear: 'Second Year', program: 'Civil Engineering', hometown: 'Charlottetown' }),
      player('2022-23', 'Angela Muyang Chen', 'angela-muyang-chen', 9466, { eligYear: '4', academicYear: 'Fourth Year', program: 'Computer Science', hometown: 'Richmond Hill', aliases: ['Angela Chen'] }),
      player('2022-23', 'Chi On (Harry) Soo', 'chi-on-harry-soo', 9467, { eligYear: '3', academicYear: 'Fourth Year', program: 'Accounting and Financial Management', hometown: 'Mississauga', aliases: ['Harry Soo', 'Chi On Soo'] }),
      player('2022-23', 'Rachel Tang', 'rachel-tang', 9468, { eligYear: '1', academicYear: 'Third Year', program: 'Biomedical Sciences', hometown: 'Markham' }),
      player('2022-23', 'Kyle Long Hung To', 'kyle-long-hung-to', 9469, { eligYear: '3', academicYear: 'Fourth Year', program: 'Electrical Engineering', hometown: 'Richmond Hill', aliases: ['Kyle To'] }),
      player('2022-23', 'Tsz Ying (Belle) Tuen', 'tsz-ying-belle-tuen', 9470, { eligYear: '4', academicYear: 'Fifth Year', program: 'Geomatics', hometown: 'Aurora', aliases: ['Belle Tuen'] }),
      player('2022-23', 'Kevin Wang', 'kevin-wang', 9471, { eligYear: '3', academicYear: 'Second Year', program: 'Computer Science', hometown: 'Mississauga' }),
      player('2022-23', 'Nicole Wang', 'nicole-wang', 9472, { eligYear: '2', academicYear: 'Second Year', program: 'Optometry', hometown: 'Hamilton' }),
      player('2022-23', 'Ashley Wong', 'ashley-wong', 9474, { eligYear: '2', academicYear: 'Second Year', program: 'Architectural Engineering', hometown: 'Markham' }),
      player('2022-23', 'Maggie (Man Yan) Wong', 'maggie-man-yan-wong', 9473, { eligYear: '3', academicYear: 'Fourth Year', program: 'Nanotechnology Engineering', hometown: 'Markham', aliases: ['Maggie Wong'] }),
      player('2022-23', 'Sherry Wu', 'sherry-wu', 9475, { eligYear: '3', academicYear: 'Fourth Year', program: 'Global Business & Digital Arts', hometown: 'Kanata' }),
    ],
    coaches: [
      staff('2022-23', 'Mat Marr', 'Badminton Head Coach', 'coaches/mat-marr', 1746, 'coaches'),
    ],
    supportStaff: [],
  },
};

export function getRosterBySeason(season) {
  return ROSTERS_BY_SEASON[season] || ROSTERS_BY_SEASON[ROSTER_SEASONS[0].value];
}

function getRosterProfilePeopleBySeason(season) {
  const roster = getRosterBySeason(season);
  return [
    ...roster.players,
    ...roster.coaches,
  ];
}

function isSupportStaffRecord(rosterPlayer) {
  return rosterPlayer && rosterPlayer.roleGroup === 'supportStaff';
}

export function findRosterPlayer(season, slug) {
  return getRosterProfilePeopleBySeason(season).find(person => person.slug === slug);
}

export function normalizeRosterName(name) {
  return (name || '')
    .replace(/^t_/i, '')
    .replace(/\([^)]*\)/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

export function rosterNameCandidates(rosterPlayer) {
  return [rosterPlayer.name, ...(rosterPlayer.aliases || [])].map(normalizeRosterName);
}

function localPlayerNameCandidates(localPlayer) {
  if (!localPlayer) return [];

  return [
    localPlayer.name,
    `${localPlayer.first_name || ''} ${localPlayer.last_name || ''}`,
  ]
    .map(normalizeRosterName)
    .filter(Boolean);
}

function candidateSet(rosterPlayer) {
  return new Set(rosterNameCandidates(rosterPlayer).filter(Boolean));
}

function namesOverlap(left, right) {
  const leftNames = candidateSet(left);
  const rightNames = candidateSet(right);
  return [...leftNames].some(name => rightNames.has(name));
}

export function findLatestRosterRecord(rosterPlayer) {
  if (!rosterPlayer) return undefined;

  for (const season of ROSTER_SEASONS) {
    const match = getRosterProfilePeopleBySeason(season.value).find(player => namesOverlap(player, rosterPlayer));
    if (match) return match;
  }

  return rosterPlayer;
}

export function findLocalPlayerForRoster(rosterPlayer, localPlayers) {
  const rosterNames = rosterNameCandidates(rosterPlayer);
  return (localPlayers || []).find(localPlayer => {
    const localNames = localPlayerNameCandidates(localPlayer);
    return localNames.some(localName => rosterNames.includes(localName));
  });
}

export function findRosterRecordForLocalPlayer(season, localPlayer) {
  const localNames = localPlayerNameCandidates(localPlayer);
  if (!season || localNames.length === 0) return undefined;

  return getRosterProfilePeopleBySeason(season).find(rosterPlayer => (
    rosterNameCandidates(rosterPlayer).some(name => localNames.includes(name))
  ));
}

export function findLatestRosterRecordForLocalPlayer(localPlayer) {
  const localNames = localPlayerNameCandidates(localPlayer);
  if (localNames.length === 0) return undefined;

  for (const season of ROSTER_SEASONS) {
    const match = getRosterProfilePeopleBySeason(season.value).find(player => (
      rosterNameCandidates(player).some(name => localNames.includes(name))
    ));
    if (match) return match;
  }

  return undefined;
}

export function getRosterProfilePath(rosterPlayer) {
  if (isSupportStaffRecord(rosterPlayer)) return undefined;
  if (!rosterPlayer || !rosterPlayer.season || !rosterPlayer.slug) return undefined;
  return `/players/${rosterPlayer.season}/${rosterPlayer.slug}`;
}

export function getRosterDbProfilePath(rosterPlayer, localPlayers) {
  if (isSupportStaffRecord(rosterPlayer)) return undefined;
  if (!rosterPlayer || !rosterPlayer.season) return undefined;

  const localPlayer = findLocalPlayerForRoster(rosterPlayer, localPlayers);
  if (!localPlayer || localPlayer.id === undefined || localPlayer.id === null) return undefined;

  return `/players/${rosterPlayer.season}/id/${localPlayer.id}`;
}

export function getRosterCardProfilePath(rosterPlayer, localPlayers) {
  return getRosterDbProfilePath(rosterPlayer, localPlayers) || getRosterProfilePath(rosterPlayer);
}

export function getLocalPlayerRosterProfilePath(localPlayer) {
  if (!localPlayer || localPlayer.id === undefined || localPlayer.id === null) return undefined;

  const rosterRecord = findLatestRosterRecordForLocalPlayer(localPlayer);
  if (rosterRecord) {
    return `/players/${rosterRecord.season}/id/${localPlayer.id}`;
  }

  return `/players/${localPlayer.id}`;
}

export function getRosterAvatar(rosterPlayer) {
  if (rosterPlayer && rosterPlayer.photoUrl) {
    return { type: 'image', src: rosterPlayer.photoUrl };
  }

  const initials = (rosterPlayer && rosterPlayer.name ? rosterPlayer.name : 'Varsity Badminton')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0])
    .join('')
    .toUpperCase();

  return { type: 'initials', initials };
}

export function getRosterPlayerAvatar(rosterPlayer) {
  const latestRosterRecord = findLatestRosterRecord(rosterPlayer);
  const latestPhotoRecord = rosterPlayer
    ? ROSTER_SEASONS
      .flatMap(season => getRosterBySeason(season.value).players)
      .find(player => namesOverlap(player, rosterPlayer) && player.photoUrl)
    : undefined;

  return getRosterAvatar({
    name: rosterPlayer && rosterPlayer.name,
    photoUrl: (latestPhotoRecord && latestPhotoRecord.photoUrl) || (latestRosterRecord && latestRosterRecord.photoUrl),
  });
}

export function getStatsSeasonRange(value) {
  return [...ROSTER_STATS_SEASONS, ALL_TIME_STATS_SEASON].find(option => option.value === value) || ALL_TIME_STATS_SEASON;
}

export function hasPlayerStats(record) {
  if (!record) return false;

  return [
    'singles_wins',
    'singles_losses',
    'doubles_wins',
    'doubles_losses',
    'mixed_wins',
    'mixed_losses',
  ].some(key => Number(record[key] || 0) > 0);
}
