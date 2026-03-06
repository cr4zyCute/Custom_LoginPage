
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function checkTheme() {
  const theme = await prisma.theme.findUnique({
    where: { name: 'Healthcare Green' }
  })
  console.log(JSON.stringify(theme, null, 2))
}

checkTheme()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect())
