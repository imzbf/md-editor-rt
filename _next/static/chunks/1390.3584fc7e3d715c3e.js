"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[1390],{1390:(e,t,a)=>{a.r(t),a.d(t,{Cassandra:()=>W,MSSQL:()=>$,MariaSQL:()=>E,MySQL:()=>D,PLSQL:()=>G,PostgreSQL:()=>Z,SQLDialect:()=>X,SQLite:()=>A,StandardSQL:()=>R,keywordCompletionSource:()=>B,schemaCompletionSource:()=>I,sql:()=>J});var n=a(9119),r=a(5524),i=a(3105),s=a(4790);function o(e){return e>=65&&e<=90||e>=97&&e<=122||e>=48&&e<=57}function l(e,t,a){for(let n=!1;;){if(e.next<0)return;if(e.next==t&&!n){e.advance();return}n=a&&!n&&92==e.next,e.advance()}}function c(e,t){for(;95==e.next||o(e.next);)null!=t&&(t+=String.fromCharCode(e.next)),e.advance();return t}function d(e,t){for(;48==e.next||49==e.next;)e.advance();t&&e.next==t&&e.advance()}function u(e,t){for(;;){if(46==e.next){if(t)break;t=!0}else if(e.next<48||e.next>57)break;e.advance()}if(69==e.next||101==e.next)for(e.advance(),(43==e.next||45==e.next)&&e.advance();e.next>=48&&e.next<=57;)e.advance()}function m(e){for(;!(e.next<0||10==e.next);)e.advance()}function p(e,t){for(let a=0;a<t.length;a++)if(t.charCodeAt(a)==e)return!0;return!1}let f=" 	\r\n";function g(e,t,a){let n=Object.create(null);for(let t of(n.true=n.false=5,n.null=n.unknown=6,e.split(" ")))t&&(n[t]=20);for(let e of t.split(" "))e&&(n[e]=21);for(let e of(a||"").split(" "))e&&(n[e]=24);return n}let h="array binary bit boolean char character clob date decimal double float int integer interval large national nchar nclob numeric object precision real smallint time timestamp varchar varying ",_="absolute action add after all allocate alter and any are as asc assertion at authorization before begin between both breadth by call cascade cascaded case cast catalog check close collate collation column commit condition connect connection constraint constraints constructor continue corresponding count create cross cube current current_date current_default_transform_group current_transform_group_for_type current_path current_role current_time current_timestamp current_user cursor cycle data day deallocate declare default deferrable deferred delete depth deref desc describe descriptor deterministic diagnostics disconnect distinct do domain drop dynamic each else elseif end end-exec equals escape except exception exec execute exists exit external fetch first for foreign found from free full function general get global go goto grant group grouping handle having hold hour identity if immediate in indicator initially inner inout input insert intersect into is isolation join key language last lateral leading leave left level like limit local localtime localtimestamp locator loop map match method minute modifies module month names natural nesting new next no none not of old on only open option or order ordinality out outer output overlaps pad parameter partial path prepare preserve primary prior privileges procedure public read reads recursive redo ref references referencing relative release repeat resignal restrict result return returns revoke right role rollback rollup routine row rows savepoint schema scroll search second section select session session_user set sets signal similar size some space specific specifictype sql sqlexception sqlstate sqlwarning start state static system_user table temporary then timezone_hour timezone_minute to trailing transaction translation treat trigger under undo union unique unnest until update usage user using value values view when whenever where while with without work write year zone ",b={backslashEscapes:!1,hashComments:!1,spaceAfterDashes:!1,slashComments:!1,doubleQuotedStrings:!1,doubleDollarQuotedStrings:!1,unquotedBitLiterals:!1,treatBitsAsBytes:!1,charSetCasts:!1,plsqlQuotingMechanism:!1,operatorChars:"*+-%<>!=&|~^/",specialVar:"?",identifierQuotes:'"',caseInsensitiveIdentifiers:!1,words:g(_,h)};function v(e){return new i.Jq(t=>{var a,n;let{next:r}=t;if(t.advance(),p(r,f)){for(;p(t.next,f);)t.advance();t.acceptToken(36)}else if(36==r&&e.doubleDollarQuotedStrings){let e=c(t,"");36==t.next&&(t.advance(),function(e,t){e:for(;;){if(e.next<0)return;if(36==e.next){e.advance();for(let a=0;a<t.length;a++){if(e.next!=t.charCodeAt(a))continue e;e.advance()}if(36==e.next){e.advance();return}}else e.advance()}}(t,e),t.acceptToken(3))}else if(39==r||34==r&&e.doubleQuotedStrings)l(t,r,e.backslashEscapes),t.acceptToken(3);else if(35==r&&e.hashComments||47==r&&47==t.next&&e.slashComments)m(t),t.acceptToken(1);else if(45!=r||45!=t.next||e.spaceAfterDashes&&32!=t.peek(1)){if(47==r&&42==t.next){t.advance();for(let e=1;;){let a=t.next;if(t.next<0)break;if(t.advance(),42==a&&47==t.next){if(e--,t.advance(),!e)break}else 47==a&&42==t.next&&(e++,t.advance())}t.acceptToken(2)}else if((101==r||69==r)&&39==t.next)t.advance(),l(t,39,!0),t.acceptToken(3);else if((110==r||78==r)&&39==t.next&&e.charSetCasts)t.advance(),l(t,39,e.backslashEscapes),t.acceptToken(3);else if(95==r&&e.charSetCasts)for(let a=0;;a++){if(39==t.next&&a>1){t.advance(),l(t,39,e.backslashEscapes),t.acceptToken(3);break}if(!o(t.next))break;t.advance()}else if(e.plsqlQuotingMechanism&&(113==r||81==r)&&39==t.next&&t.peek(1)>0&&!p(t.peek(1),f)){let e=t.peek(1);t.advance(2),function(e,t){let a="[{<(".indexOf(String.fromCharCode(t)),n=a<0?t:"]}>)".charCodeAt(a);for(;;){if(e.next<0)return;if(e.next==n&&39==e.peek(1)){e.advance(2);return}e.advance()}}(t,e),t.acceptToken(3)}else if(40==r)t.acceptToken(7);else if(41==r)t.acceptToken(8);else if(123==r)t.acceptToken(9);else if(125==r)t.acceptToken(10);else if(91==r)t.acceptToken(11);else if(93==r)t.acceptToken(12);else if(59==r)t.acceptToken(13);else if(e.unquotedBitLiterals&&48==r&&98==t.next)t.advance(),d(t),t.acceptToken(22);else if((98==r||66==r)&&(39==t.next||34==t.next)){let a=t.next;t.advance(),e.treatBitsAsBytes?(l(t,a,e.backslashEscapes),t.acceptToken(23)):(d(t,a),t.acceptToken(22))}else if(48==r&&(120==t.next||88==t.next)||(120==r||88==r)&&39==t.next){let e=39==t.next;for(t.advance();(n=t.next)>=48&&n<=57||n>=97&&n<=102||n>=65&&n<=70;)t.advance();e&&39==t.next&&t.advance(),t.acceptToken(4)}else if(46==r&&t.next>=48&&t.next<=57)u(t,!0),t.acceptToken(4);else if(46==r)t.acceptToken(14);else if(r>=48&&r<=57)u(t,!1),t.acceptToken(4);else if(p(r,e.operatorChars)){for(;p(t.next,e.operatorChars);)t.advance();t.acceptToken(15)}else if(p(r,e.specialVar))t.next==r&&t.advance(),function(e){if(39==e.next||34==e.next||96==e.next){let t=e.next;e.advance(),l(e,t,!1)}else c(e)}(t),t.acceptToken(17);else if(p(r,e.identifierQuotes))l(t,r,!1),t.acceptToken(19);else if(58==r||44==r)t.acceptToken(16);else if(o(r)){let n=c(t,String.fromCharCode(r));t.acceptToken(46==t.next||46==t.peek(-n.length-1)?18:null!==(a=e.words[n.toLowerCase()])&&void 0!==a?a:18)}}else m(t),t.acceptToken(1)})}let y=v(b),k=i.WQ.deserialize({version:14,states:"%vQ]QQOOO#wQRO'#DSO$OQQO'#CwO%eQQO'#CxO%lQQO'#CyO%sQQO'#CzOOQQ'#DS'#DSOOQQ'#C}'#C}O'UQRO'#C{OOQQ'#Cv'#CvOOQQ'#C|'#C|Q]QQOOQOQQOOO'`QQO'#DOO(xQRO,59cO)PQQO,59cO)UQQO'#DSOOQQ,59d,59dO)cQQO,59dOOQQ,59e,59eO)jQQO,59eOOQQ,59f,59fO)qQQO,59fOOQQ-E6{-E6{OOQQ,59b,59bOOQQ-E6z-E6zOOQQ,59j,59jOOQQ-E6|-E6|O+VQRO1G.}O+^QQO,59cOOQQ1G/O1G/OOOQQ1G/P1G/POOQQ1G/Q1G/QP+kQQO'#C}O+rQQO1G.}O)PQQO,59cO,PQQO'#Cw",stateData:",[~OtOSPOSQOS~ORUOSUOTUOUUOVROXSOZTO]XO^QO_UO`UOaPObPOcPOdUOeUOfUOgUOhUO~O^]ORvXSvXTvXUvXVvXXvXZvX]vX_vX`vXavXbvXcvXdvXevXfvXgvXhvX~OsvX~P!jOa_Ob_Oc_O~ORUOSUOTUOUUOVROXSOZTO^tO_UO`UOa`Ob`Oc`OdUOeUOfUOgUOhUO~OWaO~P$ZOYcO~P$ZO[eO~P$ZORUOSUOTUOUUOVROXSOZTO^QO_UO`UOaPObPOcPOdUOeUOfUOgUOhUO~O]hOsoX~P%zOajObjOcjO~O^]ORkaSkaTkaUkaVkaXkaZka]ka_ka`kaakabkackadkaekafkagkahka~Oska~P'kO^]O~OWvXYvX[vX~P!jOWnO~P$ZOYoO~P$ZO[pO~P$ZO^]ORkiSkiTkiUkiVkiXkiZki]ki_ki`kiakibkickidkiekifkigkihki~Oski~P)xOWkaYka[ka~P'kO]hO~P$ZOWkiYki[ki~P)xOasObsOcsO~O",goto:"#hwPPPPPPPPPPPPPPPPPPPPPPPPPPx||||!Y!^!d!xPPP#[TYOZeUORSTWZbdfqT[OZQZORiZSWOZQbRQdSQfTZgWbdfqQ^PWk^lmrQl_Qm`RrseVORSTWZbdfq",nodeNames:"⚠ LineComment BlockComment String Number Bool Null ( ) { } [ ] ; . Operator Punctuation SpecialVar Identifier QuotedIdentifier Keyword Type Bits Bytes Builtin Script Statement CompositeIdentifier Parens Braces Brackets Statement",maxTerm:38,nodeProps:[["isolate",-4,1,2,3,19,""]],skippedNodes:[0,1,2],repeatNodeCount:3,tokenData:"RORO",tokenizers:[0,y],topRules:{Script:[0,25]},tokenPrec:0});function x(e){let t=e.cursor().moveTo(e.from,-1);for(;/Comment/.test(t.name);)t.moveTo(t.from,-1);return t.node}function O(e,t){let a=e.sliceString(t.from,t.to),n=/^([`'"])(.*)\1$/.exec(a);return n?n[2]:a}function w(e){return e&&("Identifier"==e.name||"QuotedIdentifier"==e.name)}function Q(e,t){for(let a=[];;){if(!t||"."!=t.name)return a;let n=x(t);if(!w(n))return a;a.unshift(O(e,n)),t=x(n)}}let C=new Set("where group having order union intersect except all distinct limit offset fetch for".split(" ")),S=/^\w*$/,q=/^[`'"]?\w*[`'"]?$/;function P(e){return e.self&&"string"==typeof e.self.label}class T{constructor(e,t){this.idQuote=e,this.idCaseInsensitive=t,this.list=[],this.children=void 0}child(e){let t=this.children||(this.children=Object.create(null));return t[e]||(e&&!this.list.some(t=>t.label==e)&&this.list.push(U(e,"type",this.idQuote,this.idCaseInsensitive)),t[e]=new T(this.idQuote,this.idCaseInsensitive))}maybeChild(e){return this.children?this.children[e]:null}addCompletion(e){let t=this.list.findIndex(t=>t.label==e.label);t>-1?this.list[t]=e:this.list.push(e)}addCompletions(e){for(let t of e)this.addCompletion("string"==typeof t?U(t,"property",this.idQuote,this.idCaseInsensitive):t)}addNamespace(e){Array.isArray(e)?this.addCompletions(e):P(e)?this.addNamespace(e.children):this.addNamespaceObject(e)}addNamespaceObject(e){for(let t of Object.keys(e)){let a=e[t],n=null,r=t.replace(/\\?\./g,e=>"."==e?"\0":e).split("\0"),i=this;P(a)&&(n=a.self,a=a.children);for(let e=0;e<r.length;e++)n&&e==r.length-1&&i.addCompletion(n),i=i.child(r[e].replace(/\\\./g,"."));i.addNamespace(a)}}}function U(e,t,a,n){return RegExp("^[a-z_][a-z_\\d]*$",n?"i":"").test(e)?{label:e,type:t}:{label:e,type:t,apply:a+e+a}}let z=k.configure({props:[n.uj.add({Statement:(0,n.tC)()}),n.x0.add({Statement:(e,t)=>({from:Math.min(e.from+100,t.doc.lineAt(e.from).to),to:e.to}),BlockComment:e=>({from:e.from+2,to:e.to-2})}),(0,r.Gv)({Keyword:r.pJ.keyword,Type:r.pJ.typeName,Builtin:r.pJ.standard(r.pJ.name),Bits:r.pJ.number,Bytes:r.pJ.string,Bool:r.pJ.bool,Null:r.pJ.null,Number:r.pJ.number,String:r.pJ.string,Identifier:r.pJ.name,QuotedIdentifier:r.pJ.special(r.pJ.string),SpecialVar:r.pJ.special(r.pJ.name),LineComment:r.pJ.lineComment,BlockComment:r.pJ.blockComment,Operator:r.pJ.operator,"Semi Punctuation":r.pJ.punctuation,"( )":r.pJ.paren,"{ }":r.pJ.brace,"[ ]":r.pJ.squareBracket})]});class X{constructor(e,t,a){this.dialect=e,this.language=t,this.spec=a}get extension(){return this.language.extension}static define(e){let t=function(e,t,a,n){let r={};for(let t in b)r[t]=(e.hasOwnProperty(t)?e:b)[t];return t&&(r.words=g(t,a||"",n)),r}(e,e.keywords,e.types,e.builtin),a=n.qp.define({name:"sql",parser:z.configure({tokenizers:[{from:y,to:v(t)}]}),languageData:{commentTokens:{line:"--",block:{open:"/*",close:"*/"}},closeBrackets:{brackets:["(","[","{","'",'"',"`"]}}});return new X(t,a,e)}}function j(e,t){return{label:e,type:t,boost:-1}}function B(e,t=!1,a){var n,r;let i;return n=e.dialect.words,r=a||j,i=Object.keys(n).map(e=>{var a;return r(t?e.toUpperCase():e,21==(a=n[e])?"type":20==a?"keyword":"variable")}),(0,s.eC)(["QuotedIdentifier","SpecialVar","String","LineComment","BlockComment","."],(0,s.Mb)(i))}function I(e){var t,a,r,i,s,o,l;let c,d;return e.schema?(t=e.schema,a=e.tables,r=e.schemas,i=e.defaultTable,s=e.defaultSchema,c=new T((null===(l=null==(o=e.dialect||R)?void 0:o.spec.identifierQuotes)||void 0===l?void 0:l[0])||'"',!!(null==o?void 0:o.spec.caseInsensitiveIdentifiers)),d=s?c.child(s):null,c.addNamespace(t),a&&(d||c).addCompletions(a),r&&c.addCompletions(r),d&&c.addCompletions(d.list),i&&c.addCompletions((d||c).child(i).list),e=>{var t,a,r;let s,o;let{parents:l,from:u,quoted:m,empty:p,aliases:f}=(t=e.state,a=e.pos,s=(0,n.qz)(t).resolveInner(a,-1),o=function(e,t){let a;for(let e=t;!a;e=e.parent){if(!e)return null;"Statement"==e.name&&(a=e)}let n=null;for(let t=a.firstChild,r=!1,i=null;t;t=t.nextSibling){let a="Keyword"==t.name?e.sliceString(t.from,t.to).toLowerCase():null,s=null;if(r){if("as"==a&&i&&w(t.nextSibling))s=O(e,t.nextSibling);else if(a&&C.has(a))break;else i&&w(t)&&(s=O(e,t))}else r="from"==a;s&&(n||(n=Object.create(null)),n[s]=function(e,t){if("CompositeIdentifier"==t.name){let a=[];for(let n=t.firstChild;n;n=n.nextSibling)w(n)&&a.push(O(e,n));return a}return[O(e,t)]}(e,i)),i=/Identifier$/.test(t.name)?t:null}return n}(t.doc,s),"Identifier"==s.name||"QuotedIdentifier"==s.name||"Keyword"==s.name?{from:s.from,quoted:"QuotedIdentifier"==s.name?t.doc.sliceString(s.from,s.from+1):null,parents:Q(t.doc,x(s)),aliases:o}:"."==s.name?{from:a,quoted:null,parents:Q(t.doc,s),aliases:o}:{from:a,quoted:null,parents:[],empty:!0,aliases:o});if(p&&!e.explicit)return null;f&&1==l.length&&(l=f[l[0]]||l);let g=c;for(let e of l){for(;!g.children||!g.children[e];)if(g==c&&d)g=d;else{if(g!=d||!i)return null;g=g.child(i)}let t=g.maybeChild(e);if(!t)return null;g=t}let h=m&&e.state.sliceDoc(e.pos,e.pos+1)==m,_=g.list;return g==c&&f&&(_=_.concat(Object.keys(f).map(e=>({label:e,type:"constant"})))),{from:u,to:h?e.pos+1:void 0,options:(r=_,m?r.map(e=>Object.assign(Object.assign({},e),{label:e.label[0]==m?e.label:m+e.label+m,apply:void 0})):r),validFor:m?q:S}}):()=>null}function J(e={}){let t=e.dialect||R;return new n.ri(t.language,[e.schema?(e.dialect||R).language.data.of({autocomplete:I(e)}):[],t.language.data.of({autocomplete:B(t,e.upperCaseKeywords,e.keywordCompletion)})])}let R=X.define({}),Z=X.define({charSetCasts:!0,doubleDollarQuotedStrings:!0,operatorChars:"+-*/<>=~!@#%^&|`?",specialVar:"",keywords:_+"abort abs absent access according ada admin aggregate alias also always analyse analyze array_agg array_max_cardinality asensitive assert assignment asymmetric atomic attach attribute attributes avg backward base64 begin_frame begin_partition bernoulli bit_length blocked bom cache called cardinality catalog_name ceil ceiling chain char_length character_length character_set_catalog character_set_name character_set_schema characteristics characters checkpoint class class_origin cluster coalesce cobol collation_catalog collation_name collation_schema collect column_name columns command_function command_function_code comment comments committed concurrently condition_number configuration conflict connection_name constant constraint_catalog constraint_name constraint_schema contains content control conversion convert copy corr cost covar_pop covar_samp csv cume_dist current_catalog current_row current_schema cursor_name database datalink datatype datetime_interval_code datetime_interval_precision db debug defaults defined definer degree delimiter delimiters dense_rank depends derived detach detail dictionary disable discard dispatch dlnewcopy dlpreviouscopy dlurlcomplete dlurlcompleteonly dlurlcompletewrite dlurlpath dlurlpathonly dlurlpathwrite dlurlscheme dlurlserver dlvalue document dump dynamic_function dynamic_function_code element elsif empty enable encoding encrypted end_frame end_partition endexec enforced enum errcode error event every exclude excluding exclusive exp explain expression extension extract family file filter final first_value flag floor following force foreach fortran forward frame_row freeze fs functions fusion generated granted greatest groups handler header hex hierarchy hint id ignore ilike immediately immutable implementation implicit import include including increment indent index indexes info inherit inherits inline insensitive instance instantiable instead integrity intersection invoker isnull key_member key_type label lag last_value lead leakproof least length library like_regex link listen ln load location lock locked log logged lower mapping matched materialized max max_cardinality maxvalue member merge message message_length message_octet_length message_text min minvalue mod mode more move multiset mumps name namespace nfc nfd nfkc nfkd nil normalize normalized nothing notice notify notnull nowait nth_value ntile nullable nullif nulls number occurrences_regex octet_length octets off offset oids operator options ordering others over overlay overriding owned owner parallel parameter_mode parameter_name parameter_ordinal_position parameter_specific_catalog parameter_specific_name parameter_specific_schema parser partition pascal passing passthrough password percent percent_rank percentile_cont percentile_disc perform period permission pg_context pg_datatype_name pg_exception_context pg_exception_detail pg_exception_hint placing plans pli policy portion position position_regex power precedes preceding prepared print_strict_params procedural procedures program publication query quote raise range rank reassign recheck recovery refresh regr_avgx regr_avgy regr_count regr_intercept regr_r2 regr_slope regr_sxx regr_sxy regr_syy reindex rename repeatable replace replica requiring reset respect restart restore result_oid returned_cardinality returned_length returned_octet_length returned_sqlstate returning reverse routine_catalog routine_name routine_schema routines row_count row_number rowtype rule scale schema_name schemas scope scope_catalog scope_name scope_schema security selective self sensitive sequence sequences serializable server server_name setof share show simple skip slice snapshot source specific_name sqlcode sqlerror sqrt stable stacked standalone statement statistics stddev_pop stddev_samp stdin stdout storage strict strip structure style subclass_origin submultiset subscription substring substring_regex succeeds sum symmetric sysid system system_time table_name tables tablesample tablespace temp template ties token top_level_count transaction_active transactions_committed transactions_rolled_back transform transforms translate translate_regex trigger_catalog trigger_name trigger_schema trim trim_array truncate trusted type types uescape unbounded uncommitted unencrypted unlink unlisten unlogged unnamed untyped upper uri use_column use_variable user_defined_type_catalog user_defined_type_code user_defined_type_name user_defined_type_schema vacuum valid validate validator value_of var_pop var_samp varbinary variable_conflict variadic verbose version versioning views volatile warning whitespace width_bucket window within wrapper xmlagg xmlattributes xmlbinary xmlcast xmlcomment xmlconcat xmldeclaration xmldocument xmlelement xmlexists xmlforest xmliterate xmlnamespaces xmlparse xmlpi xmlquery xmlroot xmlschema xmlserialize xmltable xmltext xmlvalidate yes",types:h+"bigint int8 bigserial serial8 varbit bool box bytea cidr circle precision float8 inet int4 json jsonb line lseg macaddr macaddr8 money numeric pg_lsn point polygon float4 int2 smallserial serial2 serial serial4 text timetz timestamptz tsquery tsvector txid_snapshot uuid xml"}),L="accessible algorithm analyze asensitive authors auto_increment autocommit avg avg_row_length binlog btree cache catalog_name chain change changed checkpoint checksum class_origin client_statistics coalesce code collations columns comment committed completion concurrent consistent contains contributors convert database databases day_hour day_microsecond day_minute day_second delay_key_write delayed delimiter des_key_file dev_pop dev_samp deviance directory disable discard distinctrow div dual dumpfile enable enclosed ends engine engines enum errors escaped even event events every explain extended fast field fields flush force found_rows fulltext grants handler hash high_priority hosts hour_microsecond hour_minute hour_second ignore ignore_server_ids import index index_statistics infile innodb insensitive insert_method install invoker iterate keys kill linear lines list load lock logs low_priority master master_heartbeat_period master_ssl_verify_server_cert masters max max_rows maxvalue message_text middleint migrate min min_rows minute_microsecond minute_second mod mode modify mutex mysql_errno no_write_to_binlog offline offset one online optimize optionally outfile pack_keys parser partition partitions password phase plugin plugins prev processlist profile profiles purge query quick range read_write rebuild recover regexp relaylog remove rename reorganize repair repeatable replace require resume rlike row_format rtree schedule schema_name schemas second_microsecond security sensitive separator serializable server share show slave slow snapshot soname spatial sql_big_result sql_buffer_result sql_cache sql_calc_found_rows sql_no_cache sql_small_result ssl starting starts std stddev stddev_pop stddev_samp storage straight_join subclass_origin sum suspend table_name table_statistics tables tablespace terminated triggers truncate uncommitted uninstall unlock upgrade use use_frm user_resources user_statistics utc_date utc_time utc_timestamp variables views warnings xa xor year_month zerofill",N=h+"bool blob long longblob longtext medium mediumblob mediumint mediumtext tinyblob tinyint tinytext text bigint int1 int2 int3 int4 int8 float4 float8 varbinary varcharacter precision datetime unsigned signed",V="charset clear edit ego help nopager notee nowarning pager print prompt quit rehash source status system tee",D=X.define({operatorChars:"*+-%<>!=&|^",charSetCasts:!0,doubleQuotedStrings:!0,unquotedBitLiterals:!0,hashComments:!0,spaceAfterDashes:!0,specialVar:"@?",identifierQuotes:"`",keywords:_+"group_concat "+L,types:N,builtin:V}),E=X.define({operatorChars:"*+-%<>!=&|^",charSetCasts:!0,doubleQuotedStrings:!0,unquotedBitLiterals:!0,hashComments:!0,spaceAfterDashes:!0,specialVar:"@?",identifierQuotes:"`",keywords:_+"always generated groupby_concat hard persistent shutdown soft virtual "+L,types:N,builtin:V}),$=X.define({keywords:_+"trigger proc view index for add constraint key primary foreign collate clustered nonclustered declare exec go if use index holdlock nolock nowait paglock pivot readcommitted readcommittedlock readpast readuncommitted repeatableread rowlock serializable snapshot tablock tablockx unpivot updlock with",types:h+"bigint smallint smallmoney tinyint money real text nvarchar ntext varbinary image hierarchyid uniqueidentifier sql_variant xml",builtin:"binary_checksum checksum connectionproperty context_info current_request_id error_line error_message error_number error_procedure error_severity error_state formatmessage get_filestream_transaction_context getansinull host_id host_name isnull isnumeric min_active_rowversion newid newsequentialid rowcount_big xact_state object_id",operatorChars:"*+-%<>!=^&|/",specialVar:"@"}),A=X.define({keywords:_+"abort analyze attach autoincrement conflict database detach exclusive fail glob ignore index indexed instead isnull notnull offset plan pragma query raise regexp reindex rename replace temp vacuum virtual",types:h+"bool blob long longblob longtext medium mediumblob mediumint mediumtext tinyblob tinyint tinytext text bigint int2 int8 unsigned signed real",builtin:"auth backup bail changes clone databases dbinfo dump echo eqp explain fullschema headers help import imposter indexes iotrace lint load log mode nullvalue once print prompt quit restore save scanstats separator shell show stats system tables testcase timeout timer trace vfsinfo vfslist vfsname width",operatorChars:"*+-%<>!=&|/~",identifierQuotes:'`"',specialVar:"@:?$"}),W=X.define({keywords:"add all allow alter and any apply as asc authorize batch begin by clustering columnfamily compact consistency count create custom delete desc distinct drop each_quorum exists filtering from grant if in index insert into key keyspace keyspaces level limit local_one local_quorum modify nan norecursive nosuperuser not of on one order password permission permissions primary quorum rename revoke schema select set storage superuser table three to token truncate ttl two type unlogged update use user users using values where with writetime infinity NaN",types:h+"ascii bigint blob counter frozen inet list map static text timeuuid tuple uuid varint",slashComments:!0}),G=X.define({keywords:_+"abort accept access add all alter and any arraylen as asc assert assign at attributes audit authorization avg base_table begin between binary_integer body by case cast char_base check close cluster clusters colauth column comment commit compress connected constant constraint crash create current currval cursor data_base database dba deallocate debugoff debugon declare default definition delay delete desc digits dispose distinct do drop else elseif elsif enable end entry exception exception_init exchange exclusive exists external fast fetch file for force form from function generic goto grant group having identified if immediate in increment index indexes indicator initial initrans insert interface intersect into is key level library like limited local lock log logging loop master maxextents maxtrans member minextents minus mislabel mode modify multiset new next no noaudit nocompress nologging noparallel not nowait number_base of off offline on online only option or order out package parallel partition pctfree pctincrease pctused pls_integer positive positiven pragma primary prior private privileges procedure public raise range raw rebuild record ref references refresh rename replace resource restrict return returning returns reverse revoke rollback row rowid rowlabel rownum rows run savepoint schema segment select separate set share snapshot some space split sql start statement storage subtype successful synonym tabauth table tables tablespace task terminate then to trigger truncate type union unique unlimited unrecoverable unusable update use using validate value values variable view views when whenever where while with work",builtin:"appinfo arraysize autocommit autoprint autorecovery autotrace blockterminator break btitle cmdsep colsep compatibility compute concat copycommit copytypecheck define echo editfile embedded feedback flagger flush heading headsep instance linesize lno loboffset logsource longchunksize markup native newpage numformat numwidth pagesize pause pno recsep recsepchar repfooter repheader serveroutput shiftinout show showmode spool sqlblanklines sqlcase sqlcode sqlcontinue sqlnumber sqlpluscompatibility sqlprefix sqlprompt sqlterminator suffix tab term termout timing trimout trimspool ttitle underline verify version wrap",types:h+"ascii bfile bfilename bigserial bit blob dec long number nvarchar nvarchar2 serial smallint string text uid varchar2 xml",operatorChars:"*/+-%<>!=~",doubleQuotedStrings:!0,charSetCasts:!0,plsqlQuotingMechanism:!0})}}]);