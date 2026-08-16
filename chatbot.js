/**
 * ANSHUMAN ENTERPRISES - DRAGGABLE SEMANTIC AI CHATBOT ENGINE
 * Automatically scrapes, indices, and retrieves precise content from all 36 website pages
 * and 17 PDF catalogues. Uses client-side token overlapping and fuzzy-matching NLP search.
 */

// Massive structured semantic knowledge database from all 36 HTML pages and 17 PDFs
// globalWebsiteKnowledge is lazy-loaded from chatbot_knowledge.js

document.addEventListener("DOMContentLoaded", () => {
  // Knowledge database lazy loading helper
  const getKnowledge = () => window.globalWebsiteKnowledge || [];
  
  let knowledgeLoadingPromise = null;
  function loadChatbotKnowledge() {
    if (window.globalWebsiteKnowledge) return Promise.resolve();
    if (knowledgeLoadingPromise) return knowledgeLoadingPromise;
    
    knowledgeLoadingPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'chatbot_knowledge.js';
      script.defer = true;
      script.onload = () => {
        console.log('Chatbot knowledge base lazy-loaded successfully.');
        resolve();
      };
      script.onerror = (err) => {
        console.error('Failed to load chatbot knowledge base:', err);
        knowledgeLoadingPromise = null;
        reject(err);
      };
      document.body.appendChild(script);
    });
    return knowledgeLoadingPromise;
  }

  // Pre-load knowledge database on idle page load (after 4 seconds)
  setTimeout(loadChatbotKnowledge, 4000);

  // 1. Inject Chatbot Widget Markup to Body (With full accessibility)
  const widgetHTML = `
    <div id="chatbot-widget-container">
      <!-- Floating Bubble Button (Draggable - loads at bottom-left corner) -->
      <div id="chatbot-bubble" role="button" aria-label="Open Chatbot Assistant" tabindex="0">
        <span class="material-symbols-outlined" style="user-select: none; -webkit-user-select: none;">support_agent</span>
        <div class="chat-badge"></div>
      </div>
      
      <!-- Chat Window Dialog -->
      <div id="chatbot-window">
        <!-- Header -->
        <div class="chatbot-header">
          <div class="chatbot-brand-info">
            <div class="chatbot-avatar">⚡</div>
            <div class="chatbot-header-text">
              <h4>Anshuman AI Assistant</h4>
              <span>Online (active)</span>
            </div>
          </div>
          <button id="chatbot-close" class="chatbot-close-btn" aria-label="Close Chatbot">&times;</button>
        </div>
        
        <!-- Conversation Area -->
        <div class="chatbot-messages" id="chatbot-messages-area">
          <div class="chatbot-msg-bubble ai">
            <strong>Need Help Choosing the Right Product?</strong><br>
            Talk with our support assistant to:<br>
            • compare products & explore catalogues<br>
            • understand wholesale pricing<br>
            • get CCTV placement & wiring guidance<br>
            • ask technical or safety questions<br><br>
            “Namaste 👋<br>
            Aap kis type ka electrical material ya project solution dhoond rahe hain? Main aapko suitable products aur practical guidance suggest kar sakta hoon.”
          </div>
        </div>
        
        <!-- Quick Suggestions Panel -->
        <div class="chatbot-suggestions" id="chatbot-suggestions-panel">
          <span class="chatbot-suggest-btn" data-query="address">📍 Location & Shop </span>
          <span class="chatbot-suggest-btn" data-query="discounts">💰 Bulk Discounts</span>
          <span class="chatbot-suggest-btn" data-query="cctv-placement-guide.html">📹 CCTV Placement Guide</span>
          <span class="chatbot-suggest-btn" data-query="our-catalogue.html">📄 Browse Catalogues</span>
        </div>
        
        <!-- Typing Indicator -->
        <div class="chatbot-typing" id="chatbot-typing-indicator">
          <span></span><span></span><span></span>
        </div>
        
        <!-- Input Footer -->
        <div class="chatbot-input-footer">
          <input type="text" id="chatbot-text-input" placeholder="Aap kya kharidna chahte hain? Pucho..." autocomplete="off">
          <button id="chatbot-send-btn" class="chatbot-send-btn">
            <span class="material-symbols-outlined">send</span>
          </button>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', widgetHTML);

  // 2. DOM Elements Selection
  const container = document.getElementById("chatbot-widget-container");
  const bubble = document.getElementById("chatbot-bubble");
  const win = document.getElementById("chatbot-window");
  const closeBtn = document.getElementById("chatbot-close");
  const sendBtn = document.getElementById("chatbot-send-btn");
  const textInput = document.getElementById("chatbot-text-input");
  const messagesArea = document.getElementById("chatbot-messages-area");
  const suggestionsPanel = document.getElementById("chatbot-suggestions-panel");
  const typingIndicator = document.getElementById("chatbot-typing-indicator");

  // --- DRAGGABLE CHATBOT BUBBLE SYSTEM ---
  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let initialLeft = 0;
  let initialTop = 0;
  let dragThreshold = 6; // pixels
  let hasMoved = false;

  bubble.addEventListener("dragstart", (e) => e.preventDefault());

  // Mouse drag listeners
  bubble.addEventListener("mousedown", dragStart);
  document.addEventListener("mousemove", dragMove);
  document.addEventListener("mouseup", dragEnd);

  // Touch drag listeners
  bubble.addEventListener("touchstart", dragStart, { passive: true });
  document.addEventListener("touchmove", dragMove, { passive: false });
  document.addEventListener("touchend", dragEnd);

  function dragStart(e) {
    const clientX = e.type.startsWith("touch") ? e.touches[0].clientX : e.clientX;
    const clientY = e.type.startsWith("touch") ? e.touches[0].clientY : e.clientY;
    
    isDragging = true;
    hasMoved = false;
    startX = clientX;
    startY = clientY;
    
    const rect = container.getBoundingClientRect();
    initialLeft = rect.left;
    initialTop = rect.top;
    
    container.style.bottom = "auto";
    container.style.right = "auto";
    container.style.left = `${initialLeft}px`;
    container.style.top = `${initialTop}px`;
  }

  function dragMove(e) {
    if (!isDragging) return;
    
    const clientX = e.type.startsWith("touch") ? e.touches[0].clientX : e.clientX;
    const clientY = e.type.startsWith("touch") ? e.touches[0].clientY : e.clientY;
    
    const dx = clientX - startX;
    const dy = clientY - startY;
    
    if (Math.abs(dx) > dragThreshold || Math.abs(dy) > dragThreshold) {
      hasMoved = true;
    }
    
    if (hasMoved) {
      if (e.cancelable) e.preventDefault();
      
      let newLeft = initialLeft + dx;
      let newTop = initialTop + dy;
      
      const boundaryOffset = 15;
      const minLeft = boundaryOffset;
      const maxLeft = window.innerWidth - container.offsetWidth - boundaryOffset;
      const minTop = boundaryOffset;
      const maxTop = window.innerHeight - container.offsetHeight - boundaryOffset;
      
      newLeft = Math.max(minLeft, Math.min(newLeft, maxLeft));
      newTop = Math.max(minTop, Math.min(newTop, maxTop));
      
      container.style.left = `${newLeft}px`;
      container.style.top = `${newTop}px`;
      
      // Auto-align chatbox opening orientation
      if (newLeft > window.innerWidth / 2) {
        win.style.right = "0";
        win.style.left = "auto";
        win.style.transformOrigin = "bottom right";
      } else {
        win.style.right = "auto";
        win.style.left = "0";
        win.style.transformOrigin = "bottom left";
      }
    }
  }

  function dragEnd(e) {
    if (!isDragging) return;
    isDragging = false;
    
    if (hasMoved) {
      bubble.style.pointerEvents = "none";
      setTimeout(() => {
        bubble.style.pointerEvents = "auto";
      }, 50);
    }
  }

  // Pre-fetch on hover/touch
  bubble.addEventListener("mouseenter", loadChatbotKnowledge);
  bubble.addEventListener("touchstart", loadChatbotKnowledge, { passive: true });

  bubble.addEventListener("click", () => {
    if (hasMoved) return;
    loadChatbotKnowledge().then(() => {
      win.classList.toggle("open");
      if (win.classList.contains("open")) {
        textInput.focus();
      }
    }).catch(() => {
      // Fallback open if loading fails
      win.classList.toggle("open");
      if (win.classList.contains("open")) {
        textInput.focus();
      }
    });
  });

  bubble.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      bubble.click();
    }
  });

  closeBtn.addEventListener("click", () => {
    win.classList.remove("open");
  });

  sendBtn.addEventListener("click", processUserInput);

  textInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      processUserInput();
    }
  });

  suggestionsPanel.addEventListener("click", (e) => {
    if (e.target.classList.contains("chatbot-suggest-btn")) {
      const query = e.target.textContent;
      const dataQuery = e.target.getAttribute("data-query");
      
      if (dataQuery === "address" || dataQuery === "discounts") {
        addUserMessage(query);
        triggerResponse(dataQuery);
      } else {
        // Direct link suggestions
        addUserMessage(query);
        triggerResponse("link_retrieval", dataQuery);
      }
    }
  });

  function addUserMessage(text) {
    const bubbleHTML = `<div class="chatbot-msg-bubble user">${escapeHtml(text)}</div>`;
    messagesArea.insertAdjacentHTML('beforeend', bubbleHTML);
    scrollToBottom();
  }

  function addAiMessage(htmlText) {
    const bubbleHTML = `<div class="chatbot-msg-bubble ai">${htmlText}</div>`;
    messagesArea.insertAdjacentHTML('beforeend', bubbleHTML);
    scrollToBottom();
  }

  function scrollToBottom() {
    messagesArea.scrollTop = messagesArea.scrollHeight;
  }

  function escapeHtml(text) {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // Trigger simulated typing dynamic response (Pure client-side semantic search)
  function triggerResponse(intentType, rawInput = "") {
    typingIndicator.style.display = "block";
    scrollToBottom();
    
    setTimeout(() => {
      typingIndicator.style.display = "none";
      const reply = getAiResponse(intentType, rawInput);
      addAiMessage(reply);
    }, 800);
  }

  function processUserInput() {
    const text = textInput.value.trim();
    if (!text) return;
    
    addUserMessage(text);
    textInput.value = "";
    
    // Perform semantic query search!
    triggerResponse("semantic_search", text);
  }

  // NLP Semantic Retriever
  function getAiResponse(intentType, rawInput) {
    const cleanQuery = rawInput.toLowerCase().trim();
    
    // 1. Greet / Address / Discount Quick overrides
    if (intentType === "address") {
      return `Hamari shop ka official address yeh hai:<br><br>
        📍 <strong>Shop No.-2, KHS-782, Sector 1, Greater Noida, UP - 201306</strong>.<br><br>
        Greater Noida aur Noida region ke project sites par **free doorstep site delivery** ready hai!`;
    }
    
    if (intentType === "discounts") {
      return `Anshuman Enterprises par aapko builder aur wholesale orders par **heavy volume discounts (30% to 40% off)** milenge!<br><br>
        Official GST invoice aur free delivery available hai. Quotation negotiate karne ke liye hume details WhatsApp karein:<br>
        💬 <a href="https://wa.me/917065815743?text=Hello%20Anshuman%20Enterprises,%20please%20send%20me%20your%20best%20wholesale%20project%20pricing." target="_blank">Chat with Aditya Tiwari on WhatsApp</a>`;
    }
    
    if (intentType === "link_retrieval") {
      const match = getKnowledge().find(item => item.url === rawInput);
      if (match) {
        return `Aapne **${match.title}** ke baare mein pucha. Maine page analyze kiya hai, iski details yahan browse karein:<br><br>
          📖 <em>"${match.content.substring(0, 160)}..."</em><br><br>
          👉 <a href="${match.url}">Open Relevant Page & Read Full Details 📄</a>`;
      }
      return `Aap is link par visit karke details browse kar sakte hain:<br>
        👉 <a href="${rawInput}">Browse Page Details 📄</a>`;
    }
    
    // 2. Bilingual Detection
    const hasHinglish = /kya|hai|kahan|de do|chahiye|lagwana|dokan|shop|milega|batao|karta|swagat|anshuman|kaise|owner|discount|milte|malik|pankha|battan|paise|kitna/.test(cleanQuery);

    if (cleanQuery.length < 3) {
      return hasHinglish 
        ? "Haan ji! Aap kisi specific brand (Havells, Polycab, KEI, CONA, Orient), catalogue ya shop address ke baare mein puch sakte hain. Main reply dene ke liye ready hoon!"
        : "Hello! Please feel free to ask about our electrical brands, pricing catalogs, CCTV installations, or bulk project discounts. I am analyzing the entire site for you!";
    }

    // 3. SEMANTIC ENGINE: Calculate matching score against all scraped knowledge nodes
    const queryTokens = cleanQuery.split(/[^a-zA-Z0-9₹\\-]+/).filter(t => t.length > 2);
    
    let bestMatch = null;
    let highestScore = 0;
    
    const stopWords = ["the", "and", "for", "with", "this", "that", "are", "kya", "hai", "batao", "kahan", "de", "do", "bhi", "mein", "aur", "hum"];
    const filteredTokens = queryTokens.filter(t => !stopWords.includes(t));

    if (filteredTokens.length === 0) {
      filteredTokens.push(...queryTokens);
    }

    getKnowledge().forEach(node => {
      let score = 0;
      const titleLower = node.title.toLowerCase();
      const contentLower = node.content.toLowerCase();
      const keywordsLower = node.keywords.toLowerCase();
      
      filteredTokens.forEach(token => {
        if (titleLower.includes(token)) score += 10;
        if (keywordsLower.includes(token)) score += 5;
        if (contentLower.includes(token)) {
          score += 2;
          const occurrences = (contentLower.match(new RegExp(token, 'g')) || []).length;
          score += occurrences * 0.5;
        }
      });
      
      if (score > highestScore) {
        highestScore = score;
        bestMatch = node;
      }
    });

    // 4. GENERATE RESPONSE BASED ON SCORE
    if (bestMatch && highestScore > 3) {
      console.log(`Semantic Match found: "${bestMatch.title}" with score ${highestScore}`);
      
      let snippet = bestMatch.content;
      if (snippet.length > 320) {
        snippet = snippet.substring(0, 320) + "...";
      }
      
      const whatsappMsg = `Hello Anshuman Enterprises, I am browsing your site and inquiring about *${bestMatch.title}*. Please send me wholesale details.`;
      const waLink = `https://wa.me/917065815743?text=${encodeURIComponent(whatsappMsg)}`;

      if (hasHinglish) {
        return `Maine poori website par **"${rawInput}"** ko analyze kiya hai aur mujhe **${bestMatch.title}** ke under details mili hain:<br><br>
          📖 <em>"${snippet}"</em><br><br>
          Aap isse related deep details aur full catalogs yahan check kar sakte hain:<br>
          👉 <a href="${bestMatch.url}">Verify Details on Page (यहाँ पढ़ें) 📄</a><br><br>
          Wholesale price list ya quotation direct WhatsApp par mangane ke liye tap karein:<br>
          💬 <a href="${waLink}" target="_blank">Chat with Aditya Tiwari on WhatsApp</a>`;
      } else {
        return `I have analyzed the entire website for **"${rawInput}"** and retrieved this highly relevant section under **${bestMatch.title}**:<br><br>
          📖 <em>"${snippet}"</em><br><br>
          You can read the comprehensive details directly on our page here:<br>
          👉 <a href="${bestMatch.url}">Read Full Details on Page 📄</a><br><br>
          For custom developer quotations and wholesale bargaining, connect directly with us:<br>
          💬 <a href="${waLink}" target="_blank">Direct WhatsApp Message</a>`;
      }
    }

    // 5. Fallback if semantic match score is too low
    if (hasHinglish) {
      return `Maine website aur catalogs ko scan kiya, par **"${rawInput}"** se related exact details nahi mili.<br><br>
        Hum wholesale ceiling fans (Havells, Orient), copper wires (Polycab, KEI), modular switches (Crabtree, CONA), aur Hikvision CCTV setup ke solutions directly website par list karte hain.<br><br>
        Aap direct owner **Aditya Tiwari (Anshu)** se WhatsApp par baat karke best prices le sakte hain:<br>
        💬 <a href="https://wa.me/917065815743?text=Hello%20Aditya%20Tiwari,%20I%20need%20a%20wholesale%20quotation%20for%20my%20project." target="_blank">WhatsApp Chat (+917065815743)</a>`;
    } else {
      return `I scanned our entire website index, but couldn't find a direct matches for **"${rawInput}"**.<br><br>
        We are authorized dealers for Polycab, KEI, Havells, Anchor, and PM CONA, supplying fans, switches, cables, and CCTV installations.<br><br>
        Please reach out to our owner, **Aditya Tiwari**, directly on WhatsApp for an immediate quotation:<br>
        💬 <a href="https://wa.me/917065815743" target="_blank">WhatsApp Helpline (+917065815743)</a>`;
    }
  }
});

// GLOBAL LEADS INTERCEPTION & SUPABASE LOGGING
(function() {
  document.addEventListener('submit', function(event) {
    const form = event.target;
    if (form && (form.id === 'leadForm' || form.id === 'web3Form' || form.action.includes('web3forms'))) {
      try {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Extract fields safely
        const fullName = data.name || data.fullName || data.full_name || 'Anonymous';
        const phoneNumber = data.phone || data.phoneNumber || data.phone_number || 'Not provided';
        const emailAddress = data.email || null;
        const heardFrom = data.heard_from || data.source || null;
        const messageText = data.message || data.subject || 'Form Submission (Direct Sourcing Inquiry)';
        
        // Call Supabase REST API in parallel (non-blocking)
        fetch('https://ojracvgpsmppxtszrjrw.supabase.co/rest/v1/website_leads', {
          method: 'POST',
          headers: {
            'apikey': 'sb_publishable_K0cS9k6zO74Q-zOja5eWYQ_6T-DxfTJ',
            'Authorization': 'Bearer sb_publishable_K0cS9k6zO74Q-zOja5eWYQ_6T-DxfTJ',
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify({
            full_name: fullName,
            phone_number: phoneNumber,
            email: emailAddress,
            heard_from: heardFrom,
            message: messageText
          })
        })
        .then(response => {
          if (response.ok) {
            console.log('Lead successfully synced to PostgreSQL database via Supabase API.');
          } else {
            console.warn('Database sync responded with status:', response.status);
          }
        })
        .catch(err => {
          console.error('Failed to log lead to Supabase database:', err);
        });

        // OPTIONAL WEBHOOK INTEGRATION (e.g. n8n or Make.com for automated PDF invoicing & WhatsApp alerts)
        const leadWebhookUrl = ''; // ENTER WEBHOOK URL HERE (e.g. 'https://primary-production.up.railway.app/webhook/...')
        if (leadWebhookUrl) {
          fetch(leadWebhookUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              fullName: fullName,
              phoneNumber: phoneNumber,
              email: emailAddress,
              source: heardFrom,
              message: messageText,
              timestamp: new Date().toISOString()
            })
          })
          .then(() => console.log('Lead successfully pushed to n8n/Make Webhook.'))
          .catch(err => console.warn('Failed to push lead to Webhook:', err));
        }
      } catch (err) {
        console.error('Error in Supabase lead interception:', err);
      }
    }
  }, true); // Use capture phase to ensure we intercept early
})();

// DYNAMIC GOOGLE REVIEWS INTEGRATION FROM SUPABASE
(function() {
  function initReviews() {
    const reviewsGrid = document.getElementById('liveReviewsGrid');
    if (!reviewsGrid) return;

    fetch('https://ojracvgpsmppxtszrjrw.supabase.co/rest/v1/gbp_reviews?select=*&is_published=eq.true&order=created_time.desc', {
      method: 'GET',
      headers: {
        'apikey': 'sb_publishable_K0cS9k6zO74Q-zOja5eWYQ_6T-DxfTJ',
        'Authorization': 'Bearer sb_publishable_K0cS9k6zO74Q-zOja5eWYQ_6T-DxfTJ',
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      if (!response.ok) throw new Error('Failed to fetch reviews');
      return response.json();
    })
    .then(reviews => {
      if (!reviews || reviews.length === 0) {
        console.log('No published Google reviews found in the database.');
        return;
      }

      const isWhyGrid = reviewsGrid.classList.contains('why-grid');
      let html = '';

      reviews.forEach(r => {
        const stars = '★'.repeat(r.star_rating) + '☆'.repeat(5 - r.star_rating);
        const initial = r.reviewer_name ? r.reviewer_name.charAt(0).toUpperCase() : 'C';
        
        let timeStr = 'Recently';
        if (r.created_time) {
          try {
            const diffMs = new Date() - new Date(r.created_time);
            const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
            if (diffDays === 0) timeStr = 'Today';
            else if (diffDays === 1) timeStr = 'Yesterday';
            else if (diffDays < 30) timeStr = `${diffDays} days ago`;
            else {
              const diffMonths = Math.floor(diffDays / 30);
              timeStr = `${diffMonths} month${diffMonths > 1 ? 's' : ''} ago`;
            }
          } catch (e) {}
        }

        if (isWhyGrid) {
          html += `
            <div class="why-card">
              <div style="color: var(--gold); font-size: 20px; margin-bottom: 12px;">${stars}</div>
              <p style="font-size: 14px; font-style: italic; color: var(--text-mid); line-height: 1.6; margin-bottom: 16px;">
                “${r.review_text || 'No comment provided.'}”
              </p>
              <div>
                <h4 style="font-size: 15px; font-weight: 600; color: var(--maroon-dark);">${r.reviewer_name}</h4>
                <span style="font-size: 11px; color: var(--text-light); text-transform: uppercase; font-family: 'DM Mono', monospace;">Verified Google Review • ${timeStr}</span>
              </div>
            </div>
          `;
        } else {
          html += `
            <div class="review-card">
              <div class="review-badge">Google ⭐</div>
              <div class="review-stars">${stars}</div>
              <p class="review-text">"${r.review_text || 'No comment provided.'}"</p>
              <div class="review-author">
                ${r.reviewer_avatar ? `<img src="${r.reviewer_avatar}" alt="${r.reviewer_name}" class="review-avatar-img" style="width:40px;height:40px;border-radius:50%;object-fit:cover;">` : `<div class="review-avatar">${initial}</div>`}
                <div>
                  <div class="review-name">${r.reviewer_name}</div>
                  <div class="review-time">${timeStr} · Google Review</div>
                </div>
              </div>
            </div>
          `;
        }
      });

      if (!isWhyGrid) {
        html += `
          <div class="review-card" style="background:linear-gradient(135deg,var(--maroon-dark),var(--maroon));border:none;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;">
            <div style="font-size:48px;margin-bottom:8px;">⭐</div>
            <div style="font-family:'Cormorant Garamond',serif;font-size:22px;color:#fff;font-weight:700;margin-bottom:8px;">Happy with us?</div>
            <p style="font-size:13px;color:rgba(255,255,255,0.75);margin-bottom:20px;">Share your experience on Google and help others find us.</p>
            <a href="https://g.page/r/CdZ99l9ezVvlEBE/review" target="_blank" style="display:inline-flex;align-items:center;gap:6px;background:var(--gold);color:var(--maroon-dark);padding:10px 22px;border-radius:50px;font-size:13px;font-weight:700;text-decoration:none;">Write a Review →</a>
          </div>
        `;
      }

      reviewsGrid.innerHTML = html;
    })
    .catch(err => {
      console.warn('Could not load live reviews from Supabase:', err);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initReviews);
  } else {
    initReviews();
  }
})();


