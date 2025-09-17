import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Linkedin, Twitter, Github } from "lucide-react"

const teamMembers = [
  {
    name: "Alex Chen",
    role: "CEO & Founder",
    experience: "Former Goldman Sachs, 10+ years DeFi",
    image: "/professional-male-ceo.jpg",
    badges: ["Leadership", "Strategy"],
    social: { linkedin: "#", twitter: "#" },
  },
  {
    name: "Sarah Rodriguez",
    role: "CTO",
    experience: "Ex-Google, Blockchain architect",
    image: "/professional-female-cto.jpg",
    badges: ["Blockchain", "Architecture"],
    social: { linkedin: "#", github: "#" },
  },
  {
    name: "Michael Kim",
    role: "Head of Security",
    experience: "Cybersecurity expert, 8+ years",
    image: "/professional-male-security.jpg",
    badges: ["Security", "Auditing"],
    social: { linkedin: "#", twitter: "#" },
  },
  {
    name: "Emma Thompson",
    role: "Head of Marketing",
    experience: "Growth marketing specialist",
    image: "/professional-female-marketing.png",
    badges: ["Marketing", "Growth"],
    social: { linkedin: "#", twitter: "#" },
  },
  {
    name: "David Park",
    role: "Lead Developer",
    experience: "Full-stack blockchain developer",
    image: "/professional-male-developer.jpg",
    badges: ["Development", "Smart Contracts"],
    social: { github: "#", linkedin: "#" },
  },
  {
    name: "Lisa Wang",
    role: "Head of Operations",
    experience: "Operations & compliance expert",
    image: "/professional-female-operations.jpg",
    badges: ["Operations", "Compliance"],
    social: { linkedin: "#" },
  },
]

export function TeamSection() {
  return (
    <section className="py-16 px-4 bg-card/30">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
          <p className="text-muted-foreground">Experienced professionals driving innovation in blockchain technology</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamMembers.map((member, index) => (
            <Card key={index} className="p-6 text-center hover:bg-card/80 transition-colors">
              <div className="mb-4">
                <img
                  src={member.image || "/placeholder.svg"}
                  alt={member.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-lg font-semibold mb-1">{member.name}</h3>
                <p className="text-primary font-medium mb-2">{member.role}</p>
                <p className="text-sm text-muted-foreground mb-4">{member.experience}</p>
              </div>

              <div className="flex flex-wrap gap-2 justify-center mb-4">
                {member.badges.map((badge, badgeIndex) => (
                  <Badge key={badgeIndex} variant="secondary" className="text-xs">
                    {badge}
                  </Badge>
                ))}
              </div>

              <div className="flex justify-center gap-3">
                {member.social.linkedin && (
                  <a href={member.social.linkedin} className="text-muted-foreground hover:text-foreground">
                    <Linkedin className="w-4 h-4" />
                  </a>
                )}
                {member.social.twitter && (
                  <a href={member.social.twitter} className="text-muted-foreground hover:text-foreground">
                    <Twitter className="w-4 h-4" />
                  </a>
                )}
                {member.social.github && (
                  <a href={member.social.github} className="text-muted-foreground hover:text-foreground">
                    <Github className="w-4 h-4" />
                  </a>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
