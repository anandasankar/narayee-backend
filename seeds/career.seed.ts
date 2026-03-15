import { CourseLevel } from '@prisma/client';
import { prisma } from '../src/lib/prisma';
import logger from '../src/logger';

const careers = [
  {
    title: 'Full Stack Developer',
    shortDescription:
      'Become a job-ready full stack engineer by mastering modern frontend and backend technologies.',
    description:
      'The Full Stack Developer program is designed to take you from beginner to professional developer. You will learn how to build modern web applications from the ground up using technologies used by top companies. The course covers HTML, CSS, JavaScript, React, TypeScript, Node.js, Express, PostgreSQL, and MongoDB. You will also learn authentication systems, REST API development, and modern deployment practices using platforms like Vercel and AWS. Git workflows, collaborative development, and real production practices are also covered. Throughout the course, you will build multiple real-world projects including dashboards, SaaS platforms, and full-stack applications so that you graduate with a strong portfolio and the confidence to work as a professional developer.',
    duration: '6 Months',
    level: [CourseLevel.BEGINNER, CourseLevel.INTERMEDIATE, CourseLevel.ADVANCED],
  },
  {
    title: 'Frontend Developer',
    shortDescription:
      'Design and build modern, responsive user interfaces using industry-standard frontend technologies.',
    description:
      'The Frontend Developer course focuses on building visually appealing, high-performance web interfaces. You will learn HTML5, CSS3, Flexbox, Grid, modern JavaScript (ES6+), React, and Tailwind CSS. The course also teaches component-based architecture, state management, API integration, accessibility standards, and responsive design techniques used in modern web applications. You will build several real-world projects such as portfolios, landing pages, admin dashboards, and e-commerce interfaces. By the end of the program, you will understand how to create fast, scalable and user-friendly interfaces that meet modern UX and UI standards used by professional development teams.',
    duration: '4 Months',
    level: [CourseLevel.BEGINNER],
  },
  {
    title: 'Backend Developer',
    shortDescription: 'Build powerful server-side systems, APIs and scalable backend architectures.',
    description:
      'The Backend Developer program dives deep into the technologies that power modern applications behind the scenes. You will learn Node.js and Express.js to build robust APIs, implement authentication with JWT, design scalable database structures using PostgreSQL and MongoDB, and handle data efficiently. The course also introduces concepts such as caching, error handling, file storage, email services, and secure API design. You will gain experience with tools such as Postman, Docker basics, and CI/CD workflows. Real backend projects will help you understand how production systems are designed and maintained in professional software environments.',
    duration: '4 Months',
    level: [CourseLevel.INTERMEDIATE],
  },
  {
    title: 'Python Automation Testing',
    shortDescription: 'Automate testing processes using Python, Selenium and modern QA tools.',
    description:
      'This Python Automation Testing program prepares you for modern quality assurance and automation roles. You will start with Python programming fundamentals and gradually move into automation frameworks using Selenium WebDriver. The course includes test case design, Pytest framework usage, API testing with Python requests, and automated test reporting. You will also learn the Page Object Model design pattern, which is widely used in large automation frameworks. Additionally, the program teaches integration of automated tests into CI/CD pipelines using tools such as GitHub Actions. By the end of the course, you will build a complete automation testing project that demonstrates your testing skills to employers.',
    duration: '3 Months',
    level: [CourseLevel.BEGINNER],
  },
  {
    title: 'Support Engineer',
    shortDescription:
      'Develop the technical and communication skills required for professional IT support roles.',
    description:
      'The Support Engineer course is designed to prepare students for real-world technical support and IT operations roles. You will learn how to diagnose software and hardware issues, manage support tickets using industry tools such as Jira and Zendesk, and communicate effectively with users and clients. The program also introduces Linux basics, networking fundamentals, troubleshooting techniques, and cloud service dashboards. Students gain experience with real support scenarios, learning how to document issues, follow service-level agreements, and escalate problems efficiently. This course provides the practical skills required to start a career in technical support or IT operations.',
    duration: '2 Months',
    level: [CourseLevel.BEGINNER],
  },
  {
    title: 'DevOps Engineer',
    shortDescription:
      'Learn modern DevOps tools and practices for automated deployments and scalable infrastructure.',
    description:
      'The DevOps Engineer program focuses on bridging the gap between development and operations through automation and modern infrastructure practices. You will learn containerization using Docker, orchestration using Kubernetes, and CI/CD pipeline creation using tools such as GitHub Actions and Jenkins. The course also introduces infrastructure as code using Terraform, monitoring using Grafana and Prometheus, and cloud deployment fundamentals with AWS or GCP. You will gain practical experience managing Linux servers, writing shell scripts, and deploying applications in production environments. By the end of the course, you will understand how modern companies automate deployment, monitor systems, and maintain reliable infrastructure.',
    duration: '3 Months',
    level: [CourseLevel.INTERMEDIATE],
  },
];

export async function seedCareers(): Promise<void> {
  logger.info('--------------------------Seeding careers...--------------------------');

  for (const career of careers) {
    await prisma.career.upsert({
      where: { title: career.title },
      update: {},
      create: career,
    });
  }

  logger.info(`--------------------------Seeded ${careers.length} careers--------------------------`);
}
