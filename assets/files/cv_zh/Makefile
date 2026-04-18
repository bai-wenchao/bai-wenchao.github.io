TARGET = cv_zh
PDF = $(TARGET).pdf
TEX = $(TARGET).tex
LATEXMK_FLAGS = 

$(PDF): $(TEX)
	latexmk $(LATEXMK_FLAGS) $(TEX)
	latexmk -c

clean:
	rm -f $(TARGET).aux \
		  $(TARGET).log \
		  $(TARGET).out \
		  $(TARGET).fdb_latexmk \
		  $(TARGET).fls \
		  $(TARGET).synctex.gz \
		  $(TARGET)-blx.bib \
		  $(TARGET).bbl \
		  $(TARGET).run.xml

distclean:
	rm -f $(TARGET).aux \
		  $(TARGET).log \
		  $(TARGET).out \
		  $(TARGET).fdb_latexmk \
		  $(TARGET).fls \
		  $(TARGET).synctex.gz \
		  $(TARGET)-blx.bib \
		  $(TARGET).bbl \
		  $(TARGET).run.xml \
		  $(TARGET).synctex* \
		  $(TARGET).pdf \

.PHONY: clean