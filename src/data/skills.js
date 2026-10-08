// Technologies by area, programming first. Each area separates what was used at work (the
// A+CASA internships) from what was used in projects and coursework: that difference is the
// evidence a percentage never gave. `name` is shown as-is (product and language names);
// `nameKey` is looked up in i18n (skills.items.*) for the ones that have a translated name.
export const categories = [
  {
    key: 'Backend',
    work: [{ name: 'Python' }],
    projects: [{ name: 'C#' }, { name: 'C/C++' }],
  },
  {
    key: 'Frontend',
    work: [{ name: 'HTML/CSS/JS' }, { name: 'React.js' }],
    projects: [{ name: 'Angular' }],
  },
  {
    key: 'Mobile',
    work: [],
    projects: [{ name: 'Kotlin' }, { name: 'Android Jetpack' }],
  },
  {
    key: 'Cloud & DevOps',
    work: [{ name: 'AWS' }, { name: 'AWS Lambda' }, { name: 'GitLab' }, { name: 'Linux' }],
    projects: [{ name: 'Docker Compose' }],
  },
  {
    key: 'IoT & Automation',
    work: [{ name: 'Home Assistant' }, { name: 'MQTT' }, { name: 'REST APIs' }],
    projects: [],
  },
  {
    key: 'Data & AI',
    work: [],
    projects: [
      { name: 'SQL' },
      { nameKey: 'dataAnalysis' },
      { name: 'Machine Learning' },
      { nameKey: 'searchAlgorithms' },
    ],
  },
]

// Foundations and methods: things learned and practised (course work, projects), shown as
// plain tags with no level, because "knows the basics of" is exactly what they say.
export const foundations = [
  { nameKey: 'scrum' },
  { nameKey: 'etl' },
  { nameKey: 'dataStructures' },
  { nameKey: 'languageProcessing' },
  { nameKey: 'oop' },
  { nameKey: 'designPatterns' },
  { nameKey: 'relationalDb' },
]

// Real skills that are not what the site is selling right now (web and software roles).
// Kept in a closed "Other skills" list: still on the page for anyone who looks, no level shown.
export const otherSkills = [
  { name: 'A*' },
  { name: 'BFS' },
  { name: 'DFS' },
  { nameKey: 'genetic' },
  { nameKey: 'linearReg' },
  { nameKey: 'logisticReg' },
  { nameKey: 'decisionTrees' },
  { nameKey: 'knn' },
  { name: 'k-means' },
  { nameKey: 'neuralNets' },
  { name: 'YAML' },
  { name: 'Windows' },
  { name: 'Microsoft Office' },
  { nameKey: 'networkAdmin' },
  { nameKey: 'networkConfig' },
  { nameKey: 'voip' },
  { name: 'Adobe Photoshop' },
  { name: 'Adobe Illustrator' },
  { name: 'Adobe After Effects' },
  { name: 'Adobe Premiere' },
  { nameKey: 'cad' },
]
