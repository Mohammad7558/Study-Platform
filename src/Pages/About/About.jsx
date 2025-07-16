import React from 'react';
import { Rocket, Globe, ShieldCheck, Code2, HeartHandshake } from 'lucide-react';
import CountUp from 'react-countup';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useInView } from 'react-intersection-observer';

const About = () => {
    const [ref, inView] = useInView({
        threshold: 0.5,
        triggerOnce: true
    });

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="text-center space-y-6">
                    <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                        About <span className="text-primary">Our Company</span>
                    </h1>
                    <p className="max-w-3xl mx-auto text-lg text-muted-foreground">
                        We're building innovative solutions to solve real-world problems with cutting-edge technology and a user-first approach.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Button variant="default">Learn More</Button>
                        <Button variant="outline">Our Services</Button>
                    </div>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-16 bg-secondary/20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                                Our <span className="text-primary">Mission</span>
                            </h2>
                            <p className="mt-4 text-lg text-muted-foreground">
                                To empower businesses and individuals through technology that's accessible, intuitive, and transformative.
                            </p>
                            <div className="mt-8 space-y-6">
                                <div className="flex items-start gap-4">
                                    <Rocket className="h-6 w-6 mt-1 text-primary" />
                                    <div>
                                        <h3 className="font-semibold">Innovation Driven</h3>
                                        <p className="text-muted-foreground">
                                            We constantly push boundaries to deliver solutions that set new standards.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <HeartHandshake className="h-6 w-6 mt-1 text-primary" />
                                    <div>
                                        <h3 className="font-semibold">Customer Centric</h3>
                                        <p className="text-muted-foreground">
                                            Every decision we make starts with the user experience in mind.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-muted rounded-xl aspect-video overflow-hidden">
                            <div className="w-full h-full flex items-center justify-center bg-primary/10">
                                <Globe className="h-16 w-16 text-primary" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                        Our Core <span className="text-primary">Values</span>
                    </h2>
                    <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
                        These principles guide everything we do, from product development to customer support.
                    </p>
                </div>
                
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <div className="bg-primary/10 p-3 rounded-full w-fit">
                                <ShieldCheck className="h-6 w-6 text-primary" />
                            </div>
                            <CardTitle>Integrity</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription>
                                We believe in transparency and honesty in all our dealings, building trust with every interaction.
                            </CardDescription>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <div className="bg-primary/10 p-3 rounded-full w-fit">
                                <Code2 className="h-6 w-6 text-primary" />
                            </div>
                            <CardTitle>Excellence</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription>
                                We strive for perfection in our work, paying attention to every detail to deliver exceptional quality.
                            </CardDescription>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <div className="bg-primary/10 p-3 rounded-full w-fit">
                                <Globe className="h-6 w-6 text-primary" />
                            </div>
                            <CardTitle>Sustainability</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription>
                                We build solutions that stand the test of time, both technologically and environmentally.
                            </CardDescription>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* Stats Section with Animated Counters */}
            <section ref={ref} className="py-16 bg-primary text-primary-foreground">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <div>
                            <p className="text-4xl font-bold">
                                {inView ? <CountUp end={150} duration={2} suffix="+" /> : '0+'}
                            </p>
                            <p className="mt-2 text-primary-foreground/80">Projects Completed</p>
                        </div>
                        <div>
                            <p className="text-4xl font-bold">
                                {inView ? <CountUp end={95} duration={2} suffix="%" /> : '0%'}
                            </p>
                            <p className="mt-2 text-primary-foreground/80">Client Satisfaction</p>
                        </div>
                        <div>
                            <p className="text-4xl font-bold">
                                {inView ? <CountUp end={10} duration={2} suffix="+" /> : '0+'}
                            </p>
                            <p className="mt-2 text-primary-foreground/80">Years Experience</p>
                        </div>
                        <div>
                            <p className="text-4xl font-bold">24/7</p>
                            <p className="mt-2 text-primary-foreground/80">Support Available</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="bg-primary/5 rounded-xl p-8 md:p-12 text-center">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                        Ready to work with us?
                    </h2>
                    <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
                        Let's build something amazing together. Get in touch with our team to discuss your project.
                    </p>
                    <Button size="lg" className="mt-8">
                        Contact Us
                    </Button>
                </div>
            </section>
        </div>
    );
};

export default About;