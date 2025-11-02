# Makefile for Beamer presentation

# Configuration
TEXFILE = presentation
TEXSRC = $(TEXFILE).tex
PDF = $(TEXFILE).pdf
LATEX = latexmk
BIBTEX = bibtex
LATEX_OPTS = 

# Primary target
all: $(PDF)

# Build the presentation
$(PDF): $(TEXSRC) $(wildcard *.tex) $(wildcard figures/*)
	$(LATEX) $(LATEX_OPTS) $(TEXSRC)
	# Run twice more for cross-references and TOC
	$(LATEX) $(LATEX_OPTS) $(TEXSRC)
	$(LATEX) $(LATEX_OPTS) $(TEXSRC)
	$(LATEX) -c

# Include bibliography if needed
bib: $(TEXSRC) references.bib
	$(LATEX) $(LATEX_OPTS) $(TEXSRC)
	$(BIBTEX) $(TEXFILE)
	$(LATEX) $(LATEX_OPTS) $(TEXSRC)
	$(LATEX) $(LATEX_OPTS) $(TEXSRC)
	$(LATEX) -c

# Create a handout version
handout:
	sed 's/\\documentclass\(\[[^]]*\]\)\?{beamer}/\\documentclass[handout]{beamer}/' $(TEXSRC) > $(TEXFILE)-handout.tex
	$(LATEX) $(LATEX_OPTS) $(TEXFILE)-handout.tex
	$(LATEX) $(LATEX_OPTS) $(TEXFILE)-handout.tex
	mv $(TEXFILE)-handout.pdf handout.pdf
	$(LATEX) -c
	rm $(TEXFILE)-handout.*

# Clean temporary files
clean:
	rm -f *.aux *.log *.nav *.out *.snm *.toc *.vrb *.bbl *.blg *.dvi *.fdb_latexmk *.fls *.synctex.gz

# Clean everything including PDF
distclean: clean
	rm -f $(PDF) handout.pdf

# Force rebuilding from scratch
rebuild: clean all

.PHONY: all clean distclean rebuild bib handout
