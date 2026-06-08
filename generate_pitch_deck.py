import sys
from fpdf import FPDF

class AxxoraPitchDeck(FPDF):
    def __init__(self):
        super().__init__(orientation="L", unit="mm", format="A4")
        self.set_margin(15)
        self.set_auto_page_break(False)

    def add_slide_background(self):
        # Background color
        self.set_fill_color(253, 251, 247) # #fdfbf7
        self.rect(0, 0, 297, 210, "F")
        # Top banner line
        self.set_fill_color(184, 92, 56) # #b85c38
        self.rect(0, 0, 297, 4, "F")

    def slide_header(self, title, subtitle):
        self.add_slide_background()
        
        # Title
        self.set_font("helvetica", "B", 22)
        self.set_text_color(31, 29, 26) # #1f1d1a
        self.cell(0, 15, title, new_x="LMARGIN", new_y="NEXT")
        
        # Subtitle
        self.set_font("helvetica", "I", 12)
        self.set_text_color(104, 93, 81) # #685d51
        self.cell(0, 5, subtitle, new_x="LMARGIN", new_y="NEXT")
        self.ln(8)

    def slide_footer(self, page_num, total_pages):
        self.set_y(192)
        self.set_font("helvetica", "", 9)
        self.set_text_color(104, 93, 81)
        self.cell(0, 10, "AXXORA -- Orchestration of Distributed Intelligence", align="L")
        self.set_x(-40)
        self.cell(0, 10, f"Slide {page_num} of {total_pages}", align="R")

    def slide_1(self):
        self.add_page()
        self.add_slide_background()
        
        # Large title
        self.set_y(55)
        self.set_font("helvetica", "B", 38)
        self.set_text_color(184, 92, 56) # accent
        self.cell(0, 20, "A X X O R A", align="C", new_x="LMARGIN", new_y="NEXT")
        
        self.set_font("helvetica", "B", 18)
        self.set_text_color(31, 29, 26)
        self.cell(0, 12, "Orchestration of Distributed Intelligence for Limitless Conversations", align="C", new_x="LMARGIN", new_y="NEXT")
        
        self.set_font("helvetica", "I", 13)
        self.set_text_color(104, 93, 81)
        self.cell(0, 8, "Omnichannel Multi-Agent Integration & Performance Benchmarks", align="C", new_x="LMARGIN", new_y="NEXT")
        
        self.set_y(135)
        self.set_font("helvetica", "", 10)
        self.set_text_color(31, 29, 26)
        self.cell(0, 6, "Based on the Axxora Research Paper", align="C", new_x="LMARGIN", new_y="NEXT")
        self.cell(0, 6, "Utsav Mehta | Krish Bhimani | Vinit Solanki", align="C", new_x="LMARGIN", new_y="NEXT")
        self.cell(0, 6, "Department of Artificial Intelligence and Machine Learning", align="C", new_x="LMARGIN", new_y="NEXT")
        
        self.slide_footer(1, 7)

    def slide_2(self):
        self.add_page()
        self.slide_header("The Problem", "Bottlenecks in Modern Omnichannel Communication")
        
        self.set_font("helvetica", "", 11)
        self.set_text_color(31, 29, 26)
        self.write(6, "Traditional customer service workflows struggle with fragmented communication across multiple platforms (WhatsApp, Telegram, Instagram, Facebook Messenger), leading to delayed responses, missed leads, and siloed teams.\n\n")
        
        # Grid of three problem points
        self.set_y(65)
        self.set_font("helvetica", "B", 13)
        self.set_text_color(184, 92, 56)
        self.cell(85, 8, "1. High Cloud Bills", new_x="RIGHT", new_y="TOP")
        self.cell(6)
        self.cell(85, 8, "2. Sequential Queues", new_x="RIGHT", new_y="TOP")
        self.cell(6)
        self.cell(85, 8, "3. API Rate Limits", new_x="LMARGIN", new_y="NEXT")
        
        self.ln(2)
        self.set_font("helvetica", "", 10)
        self.set_text_color(104, 93, 81)
        self.multi_cell(85, 5, "Monolithic architectures exhaust server-side resources simply to parse, validate, and preview file formats (like CSV imports) on every database roundtrip.", new_x="RIGHT", new_y="TOP")
        self.cell(6)
        self.multi_cell(85, 5, "Single-server platforms process queues sequentially, creating massive backlogs in message responses and campaign releases during high volume periods.", new_x="RIGHT", new_y="TOP")
        self.cell(6)
        self.multi_cell(85, 5, "Direct monolithic connections to multiple chat platforms crash when API rate limits are hit or when third-party servers drop offline.", new_x="LMARGIN", new_y="NEXT")
        
        self.slide_footer(2, 7)

    def slide_3(self):
        self.add_page()
        self.slide_header("Problem Formulation", "Mathematical Modeling of Message Routing")
        
        self.set_font("helvetica", "", 10.5)
        self.set_text_color(31, 29, 26)
        self.write(6, "Axxora models incoming message streams to route them dynamically to specialized multi-agent systems:\n")
        
        self.ln(4)
        # Mathematical box
        self.set_fill_color(244, 242, 238)
        self.set_draw_color(210, 200, 190)
        self.rect(self.get_x(), self.get_y(), 267, 30, "FD")
        
        # Formulas
        self.set_y(self.get_y() + 3)
        self.set_font("courier", "B", 10.5)
        self.set_text_color(184, 92, 56)
        self.cell(0, 6, "  Incoming Stream : M = {m1, m2, ..., mn}", new_x="LMARGIN", new_y="NEXT")
        self.cell(0, 6, "  Message Tuple   : mi = (ti, pi, ui, ti) [text, platform, user, timestamp]", new_x="LMARGIN", new_y="NEXT")
        self.cell(0, 6, "  Routing Function: f: M -> A (Specialized Agent set)", new_x="LMARGIN", new_y="NEXT")
        
        self.set_y(self.get_y() + 8)
        self.set_font("helvetica", "B", 11.5)
        self.set_text_color(31, 29, 26)
        self.cell(0, 8, "Intent Prediction Probability Distribution:", new_x="LMARGIN", new_y="NEXT")
        
        self.set_font("courier", "B", 10.5)
        self.set_text_color(184, 92, 56)
        self.cell(0, 8, "  P(yk | mi) = exp(Wk * ei + bk) / SUM_j exp(Wj * ei + bj)", new_x="LMARGIN", new_y="NEXT")
        
        self.set_font("helvetica", "", 9.5)
        self.set_text_color(104, 93, 81)
        self.cell(0, 5, "  Where ei = f_theta(ti) represents the semantic vector embedding of the message.", new_x="LMARGIN", new_y="NEXT")
        
        self.slide_footer(3, 7)

    def slide_4(self):
        self.add_page()
        self.slide_header("System Optimization & Losses", "Minimizing Latency, Misclassifications, and SLA Violations")
        
        self.set_font("helvetica", "", 10.5)
        self.set_text_color(31, 29, 26)
        self.write(6, "The Axxora orchestration system operates on a multi-objective optimization problem to maximize efficiency:\n")
        
        self.ln(4)
        self.set_fill_color(244, 242, 238)
        self.set_draw_color(210, 200, 190)
        self.rect(self.get_x(), self.get_y(), 267, 14, "FD")
        
        self.set_y(self.get_y() + 3)
        self.set_font("courier", "B", 13)
        self.set_text_color(184, 92, 56)
        self.cell(0, 8, "  min( alpha * T_response + beta * E_routing + gamma * SLA_violations )", align="C", new_x="LMARGIN", new_y="NEXT")
        
        self.ln(4)
        self.set_font("helvetica", "", 9.5)
        self.set_text_color(104, 93, 81)
        self.cell(0, 5, "  - T_response     : average system response time", new_x="LMARGIN", new_y="NEXT")
        self.cell(0, 5, "  - E_routing      : misclassification rate of intent routing", new_x="LMARGIN", new_y="NEXT")
        self.cell(0, 5, "  - SLA_violations : proportion of delayed responses", new_x="LMARGIN", new_y="NEXT")
        
        self.ln(5)
        self.set_font("helvetica", "B", 11.5)
        self.set_text_color(31, 29, 26)
        self.cell(0, 6, "Categorical Cross-Entropy Loss (Intent Training):", new_x="LMARGIN", new_y="NEXT")
        
        self.set_font("courier", "B", 10.5)
        self.set_text_color(184, 92, 56)
        self.cell(0, 6, "  L = - (1 / N) * SUM_i SUM_k y_ik * log P(yk | mi)", new_x="LMARGIN", new_y="NEXT")
        
        self.slide_footer(4, 7)

    def slide_5(self):
        self.add_page()
        self.slide_header("Decoupled Key Technologies", "Modular Stack for High-Performance Workspaces")
        
        self.set_font("helvetica", "", 10.5)
        self.set_text_color(31, 29, 26)
        self.write(6, "Axxora brings together cloud architectures and new-age AI frameworks to support scale:\n\n")
        
        # Two-column layout
        self.set_font("helvetica", "B", 12)
        self.set_text_color(184, 92, 56)
        self.cell(130, 8, "AI Orchestration & Backend", new_x="RIGHT", new_y="TOP")
        self.cell(7)
        self.cell(130, 8, "Storage & Middleware", new_x="LMARGIN", new_y="NEXT")
        
        self.set_font("helvetica", "", 9.5)
        self.set_text_color(104, 93, 81)
        
        self.multi_cell(130, 5, "- Python 3.x & FastAPI: Handles high-throughput webhook endpoints and webhook data normalization.\n- CrewAI & LangChain: Dynamic agent creation for intent, leads, orders, support, and escalations.\n- Large Language Models: Orchestrates GPT-4, Llama 3, or Mistral models via Groq or OpenAI APIs.", new_x="RIGHT", new_y="TOP")
        self.cell(7)
        self.multi_cell(130, 5, "- MongoDB: Dedicated data store for chat logs and transaction records.\n- Redis Cache: In-memory store for session caching to preserve context during multi-turn exchanges.\n- Vector Databases: Fast cosine similarity searches to match FAQ and catalogs.\n- Supabase: Authentication and secure live data synchronization.", new_x="LMARGIN", new_y="NEXT")
        
        self.slide_footer(5, 7)

    def slide_6(self):
        self.add_page()
        self.slide_header("Quantitative Performance Evaluation", "Benchmarked Results Over 1,200 Conversational Instances")
        
        # Text and Metrics
        self.set_font("helvetica", "", 10.5)
        self.set_text_color(31, 29, 26)
        self.write(6, "Axxora was evaluated against rule-based chatbots and single-model LLM deployments over a 30-day testing window:\n\n")
        
        # Table headers
        self.set_font("helvetica", "B", 10)
        self.set_fill_color(184, 92, 56)
        self.set_text_color(255, 255, 255)
        self.cell(60, 8, "System Model", border=1, fill=True, align="C")
        self.cell(45, 8, "Accuracy", border=1, fill=True, align="C")
        self.cell(55, 8, "Avg Response Time", border=1, fill=True, align="C")
        self.cell(45, 8, "Automation Rate", border=1, fill=True, align="C")
        self.ln()
        
        # Table rows
        self.set_font("helvetica", "", 9.5)
        self.set_text_color(31, 29, 26)
        self.set_fill_color(248, 248, 248)
        
        self.cell(60, 7, "Rule-Based Bot", border=1, fill=True, align="C")
        self.cell(45, 7, "71.0%", border=1, fill=True, align="C")
        self.cell(55, 7, "2.9 min", border=1, fill=True, align="C")
        self.cell(45, 7, "55.0%", border=1, fill=True, align="C")
        self.ln()
        
        self.cell(60, 7, "Single LLM Bot", border=1, fill=True, align="C")
        self.cell(45, 7, "88.0%", border=1, fill=True, align="C")
        self.cell(55, 7, "1.3 min", border=1, fill=True, align="C")
        self.cell(45, 7, "70.0%", border=1, fill=True, align="C")
        self.ln()
        
        self.set_font("helvetica", "B", 9.5)
        self.set_fill_color(230, 245, 240)
        self.set_text_color(47, 107, 102) # Teal
        self.cell(60, 7, "Axxora (Proposed)", border=1, fill=True, align="C")
        self.cell(45, 7, "94.6%", border=1, fill=True, align="C")
        self.cell(55, 7, "41 sec", border=1, fill=True, align="C")
        self.cell(45, 7, "82.3%", border=1, fill=True, align="C")
        self.ln(9)
        
        # Highlight metrics
        self.set_font("helvetica", "B", 11)
        self.set_text_color(31, 29, 26)
        self.cell(0, 6, "Additional Key Results:", new_x="LMARGIN", new_y="NEXT")
        
        self.set_font("helvetica", "", 9.5)
        self.set_text_color(104, 93, 81)
        self.cell(0, 5, "- SLA Compliance: 96.1%  |  F1-Score: 94.0%  |  Precision: 93.8%  |  Recall: 94.2%", new_x="LMARGIN", new_y="NEXT")
        self.cell(0, 5, "- Reduced average customer response times from 4.7 minutes down to 41 seconds.", new_x="LMARGIN", new_y="NEXT")
        
        self.slide_footer(6, 7)

    def slide_7(self):
        self.add_page()
        self.slide_header("Workflow & Agent Distribution", "Mitigating Token Bloat through Modular Roles")
        
        self.set_font("helvetica", "", 10.5)
        self.set_text_color(31, 29, 26)
        self.write(6, "Rather than routing complete conversation histories through a single LLM call, Axxora allocates incoming intents to modular, task-specific agent nodes:\n\n")
        
        # Two-column layout
        self.set_font("helvetica", "B", 12)
        self.set_text_color(184, 92, 56)
        self.cell(130, 8, "Agent Specialization", new_x="RIGHT", new_y="TOP")
        self.cell(7)
        self.cell(130, 8, "Actual Traffic Share", new_x="LMARGIN", new_y="NEXT")
        
        self.set_font("helvetica", "", 9.5)
        self.set_text_color(104, 93, 81)
        
        self.multi_cell(130, 6, "- Support Agent: Resolves inquiries, matches database records, and fetches FAQs.\n- Lead Agent: Extracts prospect intent, qualifications, and syncs pipelines.\n- Order Agent: Handles transactions, processes cart checkouts, and tracks items.\n- Escalation Agent: Handles sentiment alerts and executes handoff to human operators.", new_x="RIGHT", new_y="TOP")
        
        self.cell(7)
        self.multi_cell(130, 6, "- Support Agent: 41% of total traffic\n- Lead Agent: 32% of total traffic\n- Order Agent: 18% of total traffic\n- Escalation Agent: 9% of total traffic\n\nThis structured separation guarantees clean contexts and reduces LLM hallucination rates.", new_x="LMARGIN", new_y="NEXT")
        
        self.slide_footer(7, 7)

def main():
    deck = AxxoraPitchDeck()
    deck.slide_1()
    deck.slide_2()
    deck.slide_3()
    deck.slide_4()
    deck.slide_5()
    deck.slide_6()
    deck.slide_7()
    deck.output("Axxora_Pitch_Deck.pdf")
    print("PDF Pitch Deck successfully generated as Axxora_Pitch_Deck.pdf")

if __name__ == "__main__":
    main()
