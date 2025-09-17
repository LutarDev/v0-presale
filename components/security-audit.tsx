import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Shield, CheckCircle, FileText, ExternalLink } from "lucide-react"

const auditReports = [
  {
    company: "CertiK",
    score: "98/100",
    status: "Passed",
    date: "March 2024",
    issues: "0 Critical, 0 High",
  },
  {
    company: "Quantstamp",
    score: "96/100",
    status: "Passed",
    date: "February 2024",
    issues: "0 Critical, 1 Medium (Fixed)",
  },
]

const securityFeatures = [
  "Multi-signature wallet implementation",
  "Time-locked smart contracts",
  "Automated security monitoring",
  "Regular penetration testing",
  "Bug bounty program active",
  "Decentralized governance model",
]

export function SecurityAudit() {
  return (
    <section className="py-16 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Security & Audits</h2>
          <p className="text-muted-foreground">
            Your security is our priority. Our smart contracts have been audited by leading security firms.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-500" />
              Audit Reports
            </h3>

            {auditReports.map((audit, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-semibold">{audit.company}</h4>
                    <p className="text-sm text-muted-foreground">{audit.date}</p>
                  </div>
                  <Badge className="bg-green-500/20 text-green-500 border-green-500/30">{audit.status}</Badge>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Security Score</span>
                    <span className="text-sm font-medium text-green-500">{audit.score}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Issues Found</span>
                    <span className="text-sm font-medium">{audit.issues}</span>
                  </div>
                </div>

                <Button variant="outline" size="sm" className="w-full mt-4 bg-transparent">
                  <FileText className="w-4 h-4 mr-2" />
                  View Full Report
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </Card>
            ))}
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-primary" />
              Security Features
            </h3>

            <Card className="p-6">
              <ul className="space-y-4">
                {securityFeatures.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="p-6 bg-primary/5 border-primary/20">
              <div className="flex items-start gap-3">
                <Shield className="w-6 h-6 text-primary mt-1" />
                <div>
                  <h4 className="font-semibold mb-2 text-primary">Bug Bounty Program</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    We offer rewards up to $50,000 for critical vulnerabilities. Help us maintain the highest security
                    standards.
                  </p>
                  <Button variant="outline" size="sm" className="bg-transparent">
                    Learn More
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
